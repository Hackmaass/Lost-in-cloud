/* ============================================
   LOST IN THE CLOUD — Cloud Dependency Engine
   ============================================
   Evaluates cascading health and connectivity across
   interconnected AWS resources:
   Internet -> IGW -> VPC -> ALB -> Security Group -> EC2 -> RDS / S3
   ============================================ */

export class DependencyEngine {
  static evaluate(infraState) {
    const healthReport = {
      overall: 'healthy',
      subsystems: {
        application: 'online',
        compute: 'online',
        storage: 'online',
        database: 'online',
        network: 'online',
        security: 'online',
      },
      alerts: [],
    };

    // 1. Evaluate Compute (EC2)
    const instances = Object.values(infraState.ec2?.instances || {});
    const runningInstances = instances.filter(i => i.status === 'running');
    const stoppedInstances = instances.filter(i => i.status === 'stopped');

    if (instances.length > 0 && runningInstances.length === 0) {
      healthReport.subsystems.compute = 'offline';
      healthReport.alerts.push({ level: 'CRITICAL', message: 'All EC2 compute hosts are in STOPPED state.' });
    } else if (stoppedInstances.length > 0) {
      healthReport.subsystems.compute = 'degraded';
      healthReport.alerts.push({ level: 'WARNING', message: `${stoppedInstances.length} compute host(s) stopped.` });
    }

    // 2. Evaluate Storage (EBS & S3)
    const volumes = Object.values(infraState.ebs?.volumes || {});
    const highDiskVols = volumes.filter(v => (v.usagePercent || 0) >= 90);
    if (highDiskVols.length > 0) {
      healthReport.subsystems.storage = 'critical';
      healthReport.alerts.push({ level: 'CRITICAL', message: `Disk volume ${highDiskVols[0].id} is ${highDiskVols[0].usagePercent}% full. Write operations failing.` });
    }

    // 3. Evaluate Database (RDS)
    const dbs = Object.values(infraState.rds?.databases || {});
    const degradedDBs = dbs.filter(d => (d.metrics?.connections > 200) || (d.metrics?.latencyMs > 300) || d.health === 'degraded');
    if (degradedDBs.length > 0) {
      healthReport.subsystems.database = 'high_latency';
      healthReport.alerts.push({ level: 'WARNING', message: 'Database connection pool saturation detected. Query latency elevated.' });
    }

    // 4. Evaluate Security Groups & Security
    const sgs = Object.values(infraState.sg?.securityGroups || {});
    let openSshFound = false;
    sgs.forEach(sg => {
      if (sg.inboundRules?.some(r => r.port === 22 && r.source === '0.0.0.0/0')) {
        openSshFound = true;
      }
    });

    const iamUsers = Object.values(infraState.iam?.users || {});
    const adminOverpriv = iamUsers.some(u => u.name.includes('old') && u.attachedPolicies?.includes('AdministratorAccess'));

    if (openSshFound || adminOverpriv) {
      healthReport.subsystems.security = 'alert';
      if (openSshFound) {
        healthReport.alerts.push({ level: 'CRITICAL', message: 'Port 22 (SSH) is unrestricted to the public internet.' });
      }
      if (adminOverpriv) {
        healthReport.alerts.push({ level: 'WARNING', message: 'Unrestricted legacy IAM identity with AdministratorAccess detected.' });
      }
    }

    // 5. Evaluate Load Balancer & Network
    const albs = Object.values(infraState.alb?.loadBalancers || {});
    let albHealthy = true;
    albs.forEach(alb => {
      let healthyTargets = 0;
      (alb.targets || []).forEach(tId => {
        const inst = infraState.ec2?.instances?.[tId];
        if (inst && inst.status === 'running') healthyTargets++;
      });
      if (healthyTargets === 0) {
        healthReport.subsystems.network = 'degraded';
        albHealthy = false;
      }
    });

    // 6. Cascading Application Health
    if (healthReport.subsystems.compute === 'offline' || !albHealthy) {
      healthReport.subsystems.application = 'offline';
      healthReport.overall = 'critical';
    } else if (
      healthReport.subsystems.compute === 'degraded' ||
      healthReport.subsystems.storage === 'critical' ||
      healthReport.subsystems.database === 'high_latency'
    ) {
      healthReport.subsystems.application = 'degraded';
      healthReport.overall = 'degraded';
    } else if (healthReport.subsystems.security === 'alert') {
      healthReport.overall = 'degraded';
    } else {
      healthReport.subsystems.application = 'online';
      healthReport.overall = 'healthy';
    }

    return healthReport;
  }
}

export default DependencyEngine;
