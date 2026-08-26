/* ============================================
   LOST IN THE CLOUD — Nexora Cloud Console v2.4.1
   The player's primary technical tool for cloud investigation.
   ============================================ */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGame } from '../../state/GameContext';
import StoryEngine from '../../engine/StoryEngine';
import simulator from '../../engine/cloud/CloudSimulator';
import AudioManager from '../../engine/AudioManager';
import ContextualConceptCard from '../workspace/ContextualConceptCard';
import '../../styles/terminal.css';

const AUTOCOMPLETE_DICTIONARY = [
  'help',
  'status',
  'audit-log',
  'logs',
  'metrics',
  'ec2 list',
  'ec2 start i-0a7f3c9d',
  'ec2 stop i-0a7f3c9d',
  'ec2 reboot i-0a7f3c9d',
  'ec2 inspect i-0a7f3c9d',
  's3 list',
  's3 sync /var/app/uploads s3://nexora-prod-assets',
  'iam list-users',
  'iam revoke-policy nexora-deploy-old AdministratorAccess',
  'iam rotate-keys nexora-deploy-old',
  'sg list',
  'sg revoke sg-0nexora-web-prod 22 0.0.0.0/0',
  'rds list',
  'rds terminate-external rds-nexora-prod-01',
  'asg list',
  'asg set-capacity asg-nexora-web-prod 2 6 4',
  'vpc list',
  'cost',
  'whoami',
  'clear',
  'exit',
];

export default function CloudTerminal({ isStandalone = false, onToggleExpand, isExpanded = false, onClose }) {
  const {
    state,
    addTerminalEntry,
    clearTerminal,
    completeObjective,
    completeScene,
    advanceScene,
    setStoryFlags,
    unlockConcept,
    discoverInfo,
  } = useGame();

  const [inputValue, setInputValue] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activeConceptToast, setActiveConceptToast] = useState(null);
  const outputRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [state.terminalHistory]);

  // Initial welcome message
  useEffect(() => {
    if (state.terminalHistory.length === 0) {
      addTerminalEntry({
        type: 'system',
        content: 'NEXORA CLOUD CONSOLE v2.4.1 — REGION: us-east-1',
      });
      addTerminalEntry({
        type: 'info',
        content: 'Type "help" for a list of available AWS commands (status, ec2, s3, iam, vpc, sg, rds, logs, metrics). Press TAB for autocomplete.',
      });
    }
  }, []);

  // Check scene task completion
  const checkTaskCompletion = useCallback((cleanCmd) => {
    const scene = StoryEngine.getCurrentScene(state);
    if (!scene || scene.type !== 'terminal_task') return;

    const required = (scene.requiredCommand || '').toLowerCase().trim();
    const cmd = cleanCmd.toLowerCase().trim();

    let matched = false;

    if (
      cmd === required ||
      cmd.startsWith(required) ||
      (required === 'status' && (cmd === 'system-status' || cmd === 'status')) ||
      (required === 'system-status' && (cmd === 'status' || cmd === 'system-status')) ||
      (required === 'audit-log' && (cmd === 'audit-log' || cmd === 'logs' || cmd === 'cloudtrail')) ||
      (required === 'ec2 list' && (cmd === 'ec2' || cmd === 'ec2 list' || cmd === 'describe-instances')) ||
      (required === 'describe-instances' && (cmd === 'ec2' || cmd === 'ec2 list' || cmd === 'describe-instances')) ||
      (required === 'ec2 start i-0a7f3c9d' && (cmd === 'ec2 start i-0a7f3c9d' || cmd.startsWith('ec2 start') || cmd.startsWith('ec2 restart'))) ||
      (required === 'check-storage' && (cmd === 's3' || cmd === 'df' || cmd.startsWith('s3 sync') || cmd === 's3 list')) ||
      (required === 'iam-users' && (cmd === 'iam' || cmd === 'iam list-users' || cmd === 'iam-users')) ||
      (required === 'describe-sg' && (cmd === 'sg' || cmd === 'sg list' || cmd === 'describe-sg')) ||
      (required === 'describe-rds' && (cmd === 'rds' || cmd === 'rds list' || cmd === 'describe-rds'))
    ) {
      matched = true;
    }

    if (matched) {
      AudioManager.play('terminal_success');
      if (scene.objectiveComplete) {
        completeObjective(scene.objectiveComplete);
      }
      if (scene.storyFlags) {
        setStoryFlags(scene.storyFlags);
      }
      completeScene(scene.id);

      const nextId = StoryEngine.getNextSceneId(state);
      if (nextId) {
        setTimeout(() => advanceScene(nextId), 900);
      }
    }
  }, [state, completeObjective, setStoryFlags, completeScene, advanceScene]);

  // Concept discovery trigger
  const checkConceptDiscovery = useCallback((root) => {
    if (root === 'ec2' && !state.unlockedConcepts.includes('EC2')) {
      unlockConcept('EC2');
      setActiveConceptToast({
        concept: 'EC2',
        title: 'Elastic Compute Cloud',
        description: 'Virtual server instances running in AWS data centers. Powers Nexora web services.',
      });
    } else if (root === 's3' && !state.unlockedConcepts.includes('S3')) {
      unlockConcept('S3');
      setActiveConceptToast({
        concept: 'S3',
        title: 'Simple Storage Service',
        description: 'Scalable cloud object storage for assets, backups, and user uploads.',
      });
    } else if (root === 'iam' && !state.unlockedConcepts.includes('IAM')) {
      unlockConcept('IAM');
      setActiveConceptToast({
        concept: 'IAM',
        title: 'Identity and Access Management',
        description: 'Controls permissions, credentials, and policies for users and automated roles.',
      });
    } else if (root === 'vpc' && !state.unlockedConcepts.includes('VPC')) {
      unlockConcept('VPC');
      setActiveConceptToast({
        concept: 'VPC',
        title: 'Virtual Private Cloud',
        description: 'Isolated private network topology containing Nexora subnets, gateways, and routing.',
      });
    }
  }, [state.unlockedConcepts, unlockConcept]);

  const handleCommandExecution = useCallback((rawCmd) => {
    const cleanCmd = rawCmd.trim();
    if (!cleanCmd) return;

    AudioManager.play('terminal_enter');
    addTerminalEntry({ type: 'command', content: cleanCmd });

    const tokens = cleanCmd.toLowerCase().split(/\s+/);
    const root = tokens[0];

    checkConceptDiscovery(root);

    // 1. Help
    if (root === 'help') {
      addTerminalEntry({
        type: 'output',
        content: [
          'NEXORA CLOUD OPERATIONS CONSOLE — COMMAND REFERENCE',
          '──────────────────────────────────────────────────────────────',
          '  status                                     Display live production health board',
          '  audit-log / logs                           Inspect CloudTrail security audit events',
          '  metrics                                    View CPU, memory, and error rate telemetry',
          '  ec2 list                                   List virtual compute instances & states',
          '  ec2 inspect <id>                           Inspect instance configuration & metrics',
          '  ec2 start|stop|reboot <id>                 Control compute instance lifecycle',
          '  s3 list                                    List cloud storage buckets',
          '  s3 sync <dir> <bucket>                     Sync files from disk to S3 bucket',
          '  iam list-users                             Audit IAM credentials and privileges',
          '  iam revoke-policy <user> <policy>          Revoke high-risk IAM permissions',
          '  sg list                                    Inspect Security Group firewall rules',
          '  sg revoke <sg-id> <port> <source>          Revoke unsafe ingress firewall rules',
          '  rds list                                   List managed database instances',
          '  vpc list                                   Display VPC network subnets & CIDRs',
          '  cost                                       Calculate monthly infrastructure bill',
          '  whoami                                     Display logged-in engineer credentials',
          '  clear                                      Clear terminal screen',
        ],
      });
    }

    // 2. Status / system-status
    else if (root === 'status' || root === 'system-status') {
      const snap = simulator.getStateSnapshot();
      addTerminalEntry({
        type: 'output',
        content: [
          'PRODUCTION HEALTH MONITOR — REGION: us-east-1',
          '──────────────────────────────────────────────────────────────',
          `  WEB TIER (EC2/ALB)     : [${snap.health.web.toUpperCase()}]   Instances: ${snap.instances.filter(i => i.status === 'running').length}/${snap.instances.length} running`,
          `  DATABASE (RDS)         : [${snap.health.database.toUpperCase()}]   Connections: Active`,
          `  STORAGE (EBS/S3)       : [${snap.health.storage.toUpperCase()}]   Buckets: ${snap.buckets.length} online`,
          `  NETWORK (VPC/SG)       : [${snap.health.network.toUpperCase()}]   VPCs: ${snap.vpcs.length} configured`,
          '──────────────────────────────────────────────────────────────',
          `  OVERALL SYSTEM STATUS  : ${snap.health.web === 'healthy' ? '● ALL SYSTEMS OPERATIONAL' : '▲ DEGRADED PERFORMANCE DETECTED'}`,
        ],
      });
    }

    // 3. EC2 commands
    else if (root === 'ec2' || root === 'describe-instances') {
      const sub = tokens[1] || 'list';
      const targetId = tokens[2];

      if (sub === 'list' || !tokens[1]) {
        const instances = simulator.ec2.list();
        const lines = [
          'INSTANCE ID       NAME                TYPE        STATUS      HEALTH      AZ',
          '─────────────────────────────────────────────────────────────────────────────',
        ];
        instances.forEach(inst => {
          const idPad = inst.id.padEnd(17);
          const namePad = (inst.name || 'unnamed').padEnd(19);
          const typePad = inst.type.padEnd(11);
          const statusPad = inst.status.toUpperCase().padEnd(11);
          const healthPad = (inst.health || 'healthy').toUpperCase().padEnd(11);
          const azPad = inst.az || 'us-east-1a';
          lines.push(`${idPad} ${namePad} ${typePad} ${statusPad} ${healthPad} ${azPad}`);
        });
        addTerminalEntry({ type: 'output', content: lines });
      } else if (sub === 'inspect') {
        const inst = targetId ? simulator.ec2.get(targetId) : simulator.ec2.list()[0];
        if (inst) {
          addTerminalEntry({
            type: 'output',
            content: [
              `INSTANCE DETAILS: ${inst.id} (${inst.name})`,
              '──────────────────────────────────────────────────────────────',
              `  Type: ${inst.type} | Region: us-east-1 | AZ: ${inst.az || 'us-east-1a'}`,
              `  Status: ${inst.status.toUpperCase()} | Health: ${inst.health || 'healthy'}`,
              `  Private IP: ${inst.privateIp || '10.0.1.45'} | Public IP: ${inst.publicIp || '54.210.12.88'}`,
              `  Attached Volumes: ${inst.attachedVolumes ? inst.attachedVolumes.join(', ') : 'vol-09a8f7b6'}`,
              `  Security Groups: ${inst.securityGroups ? inst.securityGroups.join(', ') : 'sg-0nexora-web-prod'}`,
            ],
          });
        } else {
          addTerminalEntry({ type: 'error', content: `Instance ${targetId} not found.` });
        }
      } else if (sub === 'start' || sub === 'restart') {
        const id = targetId || 'i-0a7f3c9d';
        const res = simulator.ec2.start(id);
        if (res.success) {
          addTerminalEntry({
            type: 'success',
            content: [
              `ec2:StartInstances [${id}] -> SUCCESS`,
              `Current State: RUNNING (2/2 checks passing)`,
              `Nexora production web endpoint auto-recovered.`,
            ],
          });
        } else {
          addTerminalEntry({ type: 'error', content: res.error || 'Failed to start instance.' });
        }
      } else if (sub === 'stop') {
        const id = targetId || 'i-0a7f3c9d';
        simulator.ec2.stop(id);
        addTerminalEntry({ type: 'warning', content: `ec2:StopInstances [${id}] -> Instance is now STOPPED.` });
      } else {
        addTerminalEntry({ type: 'error', content: `Unknown ec2 subcommand: ${sub}. Try: ec2 list, ec2 inspect <id>, ec2 start <id>` });
      }
    }

    // 4. S3 commands
    else if (root === 's3') {
      const sub = tokens[1] || 'list';
      if (sub === 'list') {
        const buckets = simulator.s3.list();
        const lines = [
          'BUCKET NAME                    CREATION DATE        REGION       ACCESS',
          '─────────────────────────────────────────────────────────────────────────────',
        ];
        buckets.forEach(b => {
          lines.push(`${b.name.padEnd(30)} 2025-08-12           us-east-1    Private`);
        });
        addTerminalEntry({ type: 'output', content: lines });
      } else if (sub === 'sync') {
        addTerminalEntry({
          type: 'success',
          content: [
            's3:Sync /var/app/uploads -> s3://nexora-prod-assets',
            'Uploaded 1,482 objects (42.8 GB). Disk space freed on EBS volume.',
            'Local disk utilization reduced to 18%.',
          ],
        });
      } else {
        addTerminalEntry({ type: 'error', content: `Unknown s3 subcommand. Try: s3 list, s3 sync <dir> <bucket>` });
      }
    }

    // 5. IAM commands
    else if (root === 'iam' || root === 'iam-users') {
      const sub = tokens[1] || 'list-users';
      if (sub === 'list-users' || root === 'iam-users') {
        const users = simulator.iam.listUsers();
        const lines = [
          'USERNAME              ROLE                      ATTACHED POLICIES               MFA',
          '─────────────────────────────────────────────────────────────────────────────────────',
        ];
        users.forEach(u => {
          lines.push(`${u.name.padEnd(21)} ${(u.role || 'Engineer').padEnd(25)} ${(u.policies || ['Read']).join(', ').padEnd(31)} ${u.mfaEnabled ? 'ENABLED' : 'DISABLED'}`);
        });
        addTerminalEntry({ type: 'output', content: lines });
      } else if (sub === 'revoke-policy') {
        addTerminalEntry({
          type: 'success',
          content: `iam:DetachUserPolicy -> AdministratorAccess revoked from nexora-deploy-old.`,
        });
      } else {
        addTerminalEntry({ type: 'error', content: `Unknown iam subcommand. Try: iam list-users, iam revoke-policy <user> <policy>` });
      }
    }

    // 6. Logs & Audit Trail (The Elias Hook)
    else if (root === 'audit-log' || root === 'logs' || root === 'cloudtrail') {
      addTerminalEntry({
        type: 'output',
        content: [
          'CLOUDTRAIL EVENT AUDIT LOG // LAST 24 HOURS',
          '─────────────────────────────────────────────────────────────────────────────────────────────',
          'EVENT TIME        USER IDENTITY        EVENT NAME               SOURCE IP        STATUS',
          '─────────────────────────────────────────────────────────────────────────────────────────────',
          '08:42:10 UTC      arjun.mehta          ec2:DescribeInstances    10.0.1.12        SUCCESS',
          '08:13:00 UTC      system-health        cloudwatch:AlarmTrigger  internal         ALARM',
          '03:17:04 UTC      nexora-deploy-old    ec2:RebootInstances      198.51.100.42    SUCCESS  [CRITICAL]',
          '03:16:59 UTC      nexora-deploy-old    iam:GetSessionToken      198.51.100.42    SUCCESS',
          'Yesterday 19:40   daniel.reyes         s3:ListBucket            10.0.1.88        SUCCESS',
        ],
      });
      discoverInfo('evt_0317_restart');
    }

    // 7. Security Groups
    else if (root === 'sg' || root === 'describe-sg') {
      const sgs = simulator.sg.list();
      const lines = [
        'GROUP ID              NAME                     INBOUND RULES (PORT / CIDR)',
        '─────────────────────────────────────────────────────────────────────────────',
      ];
      sgs.forEach(s => {
        const rulesStr = (s.inboundRules || []).map(r => `${r.port}: ${r.cidr}`).join(', ');
        lines.push(`${s.id.padEnd(21)} ${s.name.padEnd(24)} ${rulesStr}`);
      });
      addTerminalEntry({ type: 'output', content: lines });
    }

    // 8. RDS Databases
    else if (root === 'rds' || root === 'describe-rds') {
      const dbs = simulator.rds.list();
      const lines = [
        'DB IDENTIFIER         ENGINE          STATUS      PUBLIC ACCESS   STORAGE',
        '─────────────────────────────────────────────────────────────────────────────',
      ];
      dbs.forEach(d => {
        lines.push(`${d.id.padEnd(21)} ${(d.engine || 'postgres').padEnd(15)} ${(d.status || 'available').toUpperCase().padEnd(11)} ${d.publiclyAccessible ? 'YES (UNSAFE)' : 'NO (SECURE)'} 100 GB`);
      });
      addTerminalEntry({ type: 'output', content: lines });
    }

    // 9. VPC Networks
    else if (root === 'vpc' || root === 'describe-vpc') {
      const vpcs = simulator.vpc.listVPCs();
      const lines = [
        'VPC ID                NAME                     CIDR BLOCK       DEFAULT VPC',
        '─────────────────────────────────────────────────────────────────────────────',
      ];
      vpcs.forEach(v => {
        lines.push(`${v.id.padEnd(21)} ${(v.name || 'nexora-main').padEnd(24)} ${v.cidrBlock.padEnd(16)} NO`);
      });
      addTerminalEntry({ type: 'output', content: lines });
    }

    // 10. Metrics
    else if (root === 'metrics') {
      addTerminalEntry({
        type: 'output',
        content: [
          'CLOUDWATCH TELEMETRY METRICS',
          '──────────────────────────────────────────────────────────────',
          '  CPU Utilization (Average) : 34.2%',
          '  Memory Utilization        : 48.1%',
          '  Network In / Out          : 4.2 MB/s / 12.8 MB/s',
          '  HTTP 5xx Error Rate       : 0.00%',
          '  HTTP 2xx Request Rate     : 1,840 req/min',
        ],
      });
    }

    // 11. Cost
    else if (root === 'cost') {
      const snap = simulator.getStateSnapshot();
      addTerminalEntry({
        type: 'output',
        content: [
          'AWS MONTHLY ESTIMATED COST BREAKDOWN',
          '──────────────────────────────────────────────────────────────',
          `  Total Monthly Cost : $${snap.cost.toFixed(2)} USD`,
          '  Budget Status      : WITHIN ALLOCATED THRESHOLD',
        ],
      });
    }

    // 12. whoami
    else if (root === 'whoami') {
      addTerminalEntry({
        type: 'output',
        content: [
          `USER       : ${state.displayName || state.name || 'Omkar Rane'}`,
          `ROLE       : Junior Cloud Engineer`,
          `DEPARTMENT : Infrastructure Engineering`,
          `CLEARANCE  : Tier-1 Operational Access`,
          `REGION     : us-east-1 (N. Virginia)`,
        ],
      });
    }

    // 13. clear
    else if (root === 'clear') {
      clearTerminal();
      return;
    }

    // 14. exit
    else if (root === 'exit' && onClose) {
      onClose();
      return;
    }

    // Fallback
    else {
      addTerminalEntry({
        type: 'error',
        content: `Command not found: "${cleanCmd}". Type "help" to see available AWS cloud commands.`,
      });
    }

    // Check task progression
    checkTaskCompletion(cleanCmd);
  }, [state, addTerminalEntry, clearTerminal, checkConceptDiscovery, checkTaskCompletion, discoverInfo, onClose]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!inputValue.trim()) return;

      setCommandHistory(prev => [...prev, inputValue]);
      setHistoryIndex(-1);
      handleCommandExecution(inputValue);
      setInputValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputValue(commandHistory[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputValue('');
      } else {
        setHistoryIndex(nextIdx);
        setInputValue(commandHistory[nextIdx] || '');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const match = AUTOCOMPLETE_DICTIONARY.find(cmd => cmd.startsWith(inputValue.toLowerCase()));
      if (match) {
        setInputValue(match);
      }
    }
  };

  return (
    <div className={`nexora-console ${isExpanded ? 'nexora-console--expanded' : ''}`}>
      {/* Console Header Bar */}
      <div className="nexora-console__header">
        <div className="nexora-console__brand">
          <span className="nexora-console__dot" />
          <span className="nexora-console__title">NEXORA CLOUD CONSOLE v2.4.1</span>
          <span className="nexora-console__region">us-east-1</span>
        </div>

        <div className="nexora-console__controls">
          {onToggleExpand && (
            <button className="nexora-console__btn" onClick={onToggleExpand} title={isExpanded ? 'Restore' : 'Expand'}>
              {isExpanded ? '❐' : '⛶'}
            </button>
          )}
          {onClose && (
            <button className="nexora-console__btn nexora-console__btn--close" onClick={onClose} title="Close Console">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="nexora-console__output" ref={outputRef}>
        {state.terminalHistory.map((entry, index) => (
          <div key={index} className={`console-entry console-entry--${entry.type}`}>
            {entry.type === 'command' ? (
              <div className="console-entry__cmd-line">
                <span className="console-prompt">&gt;</span>
                <span className="console-cmd-text">{entry.content}</span>
              </div>
            ) : Array.isArray(entry.content) ? (
              <pre className="console-entry__pre">
                {entry.content.join('\n')}
              </pre>
            ) : (
              <div className="console-entry__text">{entry.content}</div>
            )}
          </div>
        ))}
      </div>

      {/* Command Input Bar */}
      <div className="nexora-console__input-bar" onClick={() => inputRef.current?.focus()}>
        <span className="console-prompt">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          className="nexora-console__input"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type an AWS command... (e.g. status, ec2 list, audit-log, help)"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
        <span className="nexora-console__tab-hint">TAB autocomplete</span>
      </div>

      {/* Contextual Concept Toast */}
      {activeConceptToast && (
        <ContextualConceptCard
          concept={activeConceptToast.concept}
          title={activeConceptToast.title}
          description={activeConceptToast.description}
          onClose={() => setActiveConceptToast(null)}
        />
      )}
    </div>
  );
}
