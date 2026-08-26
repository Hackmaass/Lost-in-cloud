/* ============================================
   LOST IN THE CLOUD — Central Cloud Simulator Engine
   ============================================
   Implementation of CloudProvider interface.
   Orchestrates EC2, S3, IAM, VPC, SG, ALB, ASG, RDS, CloudWatch,
   DependencyEngine, and CostEngine.
   ============================================ */

import CloudProvider from './CloudProvider';
import EC2Service from './services/EC2Service';
import EBSService from './services/EBSService';
import S3Service from './services/S3Service';
import IAMService from './services/IAMService';
import VPCService from './services/VPCService';
import SecurityGroupService from './services/SecurityGroupService';
import LoadBalancerService from './services/LoadBalancerService';
import AutoScalingService from './services/AutoScalingService';
import RDSService from './services/RDSService';
import CloudWatchService from './services/CloudWatchService';
import DependencyEngine from './DependencyEngine';
import CostEngine from './CostEngine';
import INITIAL_INFRASTRUCTURE from './initialInfrastructure';

export class CloudSimulator extends CloudProvider {
  constructor() {
    super('NexoraCloudSimulator');
    this.listeners = new Set();
    this.reset();
  }

  reset() {
    // Clone seed infrastructure
    const raw = JSON.parse(JSON.stringify(INITIAL_INFRASTRUCTURE));

    this.region = raw.currentRegion;
    this.regions = raw.regions;

    this.ec2 = new EC2Service(raw.instances);
    this.ebs = new EBSService(raw.volumes);
    this.s3 = new S3Service(raw.buckets);
    this.iam = new IAMService(raw.users, {}, raw.policies);
    this.vpc = new VPCService(raw.vpcs, raw.subnets);
    this.sg = new SecurityGroupService(raw.securityGroups);
    this.alb = new LoadBalancerService(raw.loadBalancers);
    this.asg = new AutoScalingService(raw.autoScalingGroups);
    this.rds = new RDSService(raw.databases);
    this.cloudwatch = new CloudWatchService({}, []);

    this.notify();
  }

  // Subscribe to simulator state updates
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    const state = this.getStateSnapshot();
    this.listeners.forEach(cb => {
      try { cb(state); } catch (e) { console.error('Simulator listener error:', e); }
    });
  }

  getStateSnapshot() {
    const rawState = {
      region: this.region,
      regions: this.regions,
      ec2: this.ec2,
      ebs: this.ebs,
      s3: this.s3,
      iam: this.iam,
      vpc: this.vpc,
      sg: this.sg,
      alb: this.alb,
      asg: this.asg,
      rds: this.rds,
    };

    const health = DependencyEngine.evaluate(rawState);
    const cost = CostEngine.calculateMonthlyCost(rawState);

    return {
      region: this.region,
      health,
      cost,
      instances: this.ec2.list(),
      volumes: this.ebs.list(),
      buckets: this.s3.list(),
      iamUsers: this.iam.listUsers(),
      securityGroups: this.sg.list(),
      loadBalancers: this.alb.list(),
      autoScalingGroups: this.asg.list(),
      databases: this.rds.list(),
      vpcs: this.vpc.listVPCs(),
      subnets: this.vpc.listSubnets(),
      recentLogs: this.cloudwatch.getLogs({}, 20),
    };
  }

  // Set mission-specific fault states
  applyMissionFault(missionId) {
    switch (missionId) {
      case 'mission_02': {
        // EC2 instance stopped
        const inst = this.ec2.get('i-0a7f3c9d');
        if (inst) {
          inst.status = 'stopped';
          inst.health = 'unhealthy';
        }
        this.cloudwatch.log({
          level: 'ERROR',
          source: 'ec2',
          message: 'Instance i-0a7f3c9d stopped unexpectedly at 03:17:42 UTC',
        });
        break;
      }
      case 'mission_03': {
        // Disk volume near full
        const vol = this.ebs.get('vol-09a8f7b6c5d4e3f21');
        if (vol) {
          vol.usedGB = 19.2;
          vol.availableGB = 0.8;
          vol.usagePercent = 96;
        }
        this.cloudwatch.log({
          level: 'CRITICAL',
          source: 'ebs',
          message: 'Filesystem /dev/xvda1 capacity at 96%. Write operations failing.',
        });
        break;
      }
      case 'mission_05': {
        // Open SSH in security group
        const sg = this.sg.get('sg-0nexora-web-prod');
        if (sg && !sg.inboundRules.some(r => r.port === 22)) {
          sg.inboundRules.push({ protocol: 'TCP', port: 22, source: '0.0.0.0/0', description: 'SSH administrative access' });
        }
        break;
      }
      case 'mission_07': {
        // RDS connection flood
        const db = this.rds.get('nexora-prod-db');
        if (db) {
          db.metrics = { cpu: 45, connections: 247, latencyMs: 840 };
          db.health = 'degraded';
        }
        this.cloudwatch.log({
          level: 'WARN',
          source: 'rds',
          message: 'High connection count on nexora-prod-db (247 active pools from 198.51.100.47)',
        });
        break;
      }
      default:
        break;
    }
    this.notify();
  }

  // ---- Execute Cloud Action ----
  execute(commandStr, identity = 'player') {
    const tokens = commandStr.trim().split(/\s+/);
    if (tokens.length === 0 || !tokens[0]) return { success: false, error: 'Empty command' };

    const cmd = tokens[0].toLowerCase();
    const subCmd = tokens[1]?.toLowerCase();
    const target = tokens[2];
    const extra = tokens[3];

    let result = null;

    // ---- EC2 Commands ----
    if (cmd === 'ec2' || cmd === 'describe-instances') {
      if (!subCmd || subCmd === 'list' || cmd === 'describe-instances') {
        const list = this.ec2.list();
        result = {
          success: true,
          type: 'ec2_list',
          data: list,
          output: list.map(i => `${i.id.padEnd(14)} ${i.name.padEnd(20)} ${i.type.padEnd(10)} ${i.status.toUpperCase().padEnd(10)} ${i.health.toUpperCase()}`),
        };
      } else if (subCmd === 'start' && target) {
        result = this.ec2.start(target);
        if (result.success) {
          this.cloudwatch.log({ level: 'INFO', source: 'ec2', message: `StartInstances: ${target} by ${identity}` });
        }
      } else if (subCmd === 'stop' && target) {
        result = this.ec2.stop(target);
        if (result.success) {
          this.cloudwatch.log({ level: 'WARN', source: 'ec2', message: `StopInstances: ${target} by ${identity}` });
        }
      } else if (subCmd === 'reboot' && target) {
        result = this.ec2.reboot(target);
        if (result.success) {
          this.cloudwatch.log({ level: 'INFO', source: 'ec2', message: `RebootInstances: ${target} by ${identity}` });
        }
      } else if (subCmd === 'inspect' && target) {
        const inst = this.ec2.get(target);
        if (inst) {
          result = { success: true, type: 'inspect', data: inst, output: [JSON.stringify(inst, null, 2)] };
        } else {
          result = { success: false, error: `Instance ${target} not found.` };
        }
      }
    }

    // ---- S3 Commands ----
    else if (cmd === 's3' || cmd === 'list-buckets') {
      if (!subCmd || subCmd === 'list' || cmd === 'list-buckets') {
        const list = this.s3.list();
        result = {
          success: true,
          type: 's3_list',
          data: list,
          output: list.map(b => `s3://${b.name.padEnd(25)} ${b.region.padEnd(12)} ${b.sizeGB} GB (${b.objectsCount} objs)`),
        };
      } else if (subCmd === 'sync' && target && extra) {
        // e.g. s3 sync /var/app/uploads s3://nexora-prod-assets
        const bucketName = extra.replace('s3://', '');
        result = this.s3.syncDirectory(bucketName, target);
        if (result.success) {
          // Free storage on EBS as consequence!
          const vol = this.ebs.get('vol-09a8f7b6c5d4e3f21');
          if (vol) this.ebs.freeSpace('vol-09a8f7b6c5d4e3f21', 14.0);
          this.cloudwatch.log({ level: 'INFO', source: 's3', message: `SyncCompleted: ${target} -> s3://${bucketName}` });
        }
      } else if (subCmd === 'create-bucket' && target) {
        result = this.s3.createBucket(target.replace('s3://', ''), this.region);
      }
    }

    // ---- IAM Commands ----
    else if (cmd === 'iam' || cmd === 'iam-users') {
      if (!subCmd || subCmd === 'list-users' || cmd === 'iam-users') {
        const users = this.iam.listUsers();
        result = {
          success: true,
          type: 'iam_users',
          data: users,
          output: users.map(u => `${u.name.padEnd(20)} Policies: [${u.attachedPolicies.join(', ')}] MFA: ${u.mfaEnabled ? 'YES' : 'NO'}`),
        };
      } else if (subCmd === 'revoke-policy' && target && extra) {
        result = this.iam.revokePolicy(target, extra);
        if (result.success) {
          this.cloudwatch.log({ level: 'SECURITY', source: 'iam', message: `DetachUserPolicy: ${extra} from ${target} by ${identity}` });
        }
      } else if (subCmd === 'rotate-keys' && target) {
        result = this.iam.rotateAccessKeys(target);
        if (result.success) {
          this.cloudwatch.log({ level: 'SECURITY', source: 'iam', message: `CreateAccessKey / DeactivateOld: ${target}` });
        }
      }
    }

    // ---- Security Group Commands ----
    else if (cmd === 'sg' || cmd === 'describe-sg') {
      if (!subCmd || subCmd === 'list' || cmd === 'describe-sg') {
        const list = this.sg.list();
        result = {
          success: true,
          type: 'sg_list',
          data: list,
          output: list.map(s => `${s.id.padEnd(22)} ${s.name.padEnd(26)} Inbound: ${s.inboundRules.length} rules`),
        };
      } else if (subCmd === 'revoke' && target && extra) {
        const port = extra;
        const source = tokens[4] || '0.0.0.0/0';
        result = this.sg.revokeIngress(target, port, source);
        if (result.success) {
          this.cloudwatch.log({ level: 'SECURITY', source: 'security-group', message: `RevokeSecurityGroupIngress: ${target} Port ${port}` });
        }
      }
    }

    // ---- Auto Scaling Commands ----
    else if (cmd === 'asg') {
      if (!subCmd || subCmd === 'list') {
        const list = this.asg.list();
        result = {
          success: true,
          data: list,
          output: list.map(g => `${g.id.padEnd(18)} Min:${g.minSize} Max:${g.maxSize} Desired:${g.desiredCapacity} Instances:${g.currentInstances.length}`),
        };
      } else if (subCmd === 'set-capacity' && target) {
        // e.g. asg set-capacity asg-nexora-prod 2 6 3
        const min = tokens[3] ? +tokens[3].replace('--min=', '') : undefined;
        const max = tokens[4] ? +tokens[4].replace('--max=', '') : undefined;
        const desired = tokens[5] ? +tokens[5].replace('--desired=', '') : undefined;
        result = this.asg.setCapacity(target, { min, max, desired });
        if (result.success) {
          this.asg.triggerScaleEvent(target, this.ec2, this.alb);
          this.cloudwatch.log({ level: 'INFO', source: 'autoscaling', message: `SetDesiredCapacity: ${target} to ${desired || 3}` });
        }
      }
    }

    // ---- RDS Commands ----
    else if (cmd === 'rds' || cmd === 'describe-rds') {
      if (!subCmd || subCmd === 'list' || cmd === 'describe-rds') {
        const list = this.rds.list();
        result = {
          success: true,
          data: list,
          output: list.map(d => `${d.id.padEnd(18)} ${d.engine.padEnd(16)} Conns: ${d.metrics.connections} Latency: ${d.metrics.latencyMs}ms`),
        };
      } else if (subCmd === 'terminate-external' && target) {
        result = this.rds.terminateExternalConnections(target);
      }
    }

    // ---- CloudWatch / Metrics / Logs ----
    else if (cmd === 'logs' || cmd === 'cloudwatch') {
      const logs = this.cloudwatch.getLogs({}, 15);
      result = {
        success: true,
        data: logs,
        output: logs.map(l => `[${l.timestamp}] [${l.level.padEnd(8)}] [${l.source.padEnd(12)}] ${l.message}`),
      };
    }

    // ---- Cost Command ----
    else if (cmd === 'cost') {
      const cost = CostEngine.calculateMonthlyCost(this.getStateSnapshot());
      result = {
        success: true,
        data: cost,
        output: [
          `ESTIMATED MONTHLY CLOUD BILL: $${cost.totalMonthly}/month`,
          `  Compute (EC2):    $${cost.breakdown.compute}`,
          `  Storage (EBS/S3): $${cost.breakdown.storage}`,
          `  Database (RDS):   $${cost.breakdown.database}`,
          `  Networking (ALB): $${cost.breakdown.networking}`,
        ],
      };
    }

    // Default fallback
    if (!result) {
      result = { success: false, error: `Command not recognized: ${commandStr}` };
    }

    this.notify();
    return result;
  }
}

// Global singleton instance
export const simulator = new CloudSimulator();
export default simulator;
