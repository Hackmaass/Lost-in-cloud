/* ============================================
   LOST IN THE CLOUD — Evidence Registry
   ============================================
   Centralized evidence data discovered across
   missions. The 03:17 AM thread, Elias's trail,
   security changes, IAM access.
   ============================================ */

export const EVIDENCE = {
  // ---- Mission 01: The first anomaly ----
  evt_0317_restart: {
    id: 'evt_0317_restart',
    type: 'event',
    title: 'Unscheduled System Event',
    timestamp: '03:17:42 AM',
    source: 'ec2.nexora-prod',
    content: [
      'EVENT: StopInstances → StartInstances',
      'TARGET: i-0a7f3c9d (nexora-web-prod-01)',
      'TIME: 03:17:42 UTC',
      'USER: nexora-deploy-old',
      'REASON: Manual restart — no deployment record',
    ],
    discoveredIn: 'mission_01',
    significance: 'First appearance of the 03:17 AM pattern',
  },

  // ---- Mission 02: The server investigation ----
  evt_instance_unhealthy: {
    id: 'evt_instance_unhealthy',
    type: 'log',
    title: 'Instance Health Check Failure',
    timestamp: '09:23:15 AM',
    source: 'elb.nexora-prod',
    content: [
      'HEALTH CHECK FAILED: i-0a7f3c9d',
      'STATUS: unhealthy',
      'CONSECUTIVE FAILURES: 3',
      'HTTP 503 — Service Unavailable',
      'Last healthy: 03:17:42 AM',
    ],
    discoveredIn: 'mission_02',
    significance: 'Instance went unhealthy after the 03:17 restart',
  },

  evt_manual_restart_02: {
    id: 'evt_manual_restart_02',
    type: 'audit',
    title: 'CloudTrail: Manual Instance Restart',
    timestamp: '03:17:42 AM',
    source: 'cloudtrail',
    content: [
      'EVENT: StopInstances',
      'USER IDENTITY: nexora-deploy-old',
      'SOURCE IP: 198.51.100.47',
      'TIME: 03:17:42 UTC',
      '---',
      'EVENT: StartInstances',
      'USER IDENTITY: nexora-deploy-old',
      'TIME: 03:18:01 UTC',
      '---',
      'NOTE: No associated deployment pipeline execution',
      'NOTE: IP does not match any known Nexora office or VPN',
    ],
    discoveredIn: 'mission_02',
    significance: 'Production restarted manually from unknown IP',
  },

  // ---- Mission 03: Storage investigation ----
  evt_disk_usage: {
    id: 'evt_disk_usage',
    type: 'log',
    title: 'Disk Usage Report',
    timestamp: '11:04:33 AM',
    source: 'ec2.nexora-web-prod-01',
    content: [
      'FILESYSTEM    SIZE   USED   AVAIL  USE%',
      '/dev/xvda1    20G    19.2G  0.8G   96%',
      '',
      'LARGEST DIRECTORIES:',
      '/var/app/uploads    14.7G',
      '/var/log            2.1G',
      '/tmp                1.8G',
    ],
    discoveredIn: 'mission_03',
    significance: 'Uploads stored directly on instance — no object storage',
  },

  evt_s3_bucket_access: {
    id: 'evt_s3_bucket_access',
    type: 'audit',
    title: 'S3 Bucket Access Log',
    timestamp: '03:17:55 AM',
    source: 's3.nexora-prod-assets',
    content: [
      'BUCKET: nexora-prod-assets',
      'ACTION: s3:ListBucket, s3:GetObject',
      'PRINCIPAL: nexora-deploy-old',
      'TIME: 03:17:55 UTC',
      'OBJECTS ACCESSED: 847',
      '---',
      'NOTE: This identity should not have production bucket access',
    ],
    discoveredIn: 'mission_03',
    significance: 'Old deployment identity accessing production assets at 03:17',
  },

  // ---- Mission 04: IAM investigation ----
  evt_iam_identity: {
    id: 'evt_iam_identity',
    type: 'config',
    title: 'IAM User: nexora-deploy-old',
    timestamp: 'Created 2 years ago',
    source: 'iam',
    content: [
      'USER: nexora-deploy-old',
      'CREATED: 2024-03-15',
      'LAST ACTIVITY: Today, 03:17 AM',
      'STATUS: Active',
      'MFA: Not enabled',
      '',
      'ATTACHED POLICIES:',
      '  ● AdministratorAccess',
      '  ● AmazonS3FullAccess',
      '  ● AmazonEC2FullAccess',
      '  ● AmazonRDSFullAccess',
      '  ● AmazonVPCFullAccess',
      '',
      'CREATED BY: elias.ward@nexora.io',
      'DESCRIPTION: "Legacy deployment pipeline"',
    ],
    discoveredIn: 'mission_04',
    significance: 'Elias Ward\'s deployment account — admin access, still active',
  },

  evt_elias_profile: {
    id: 'evt_elias_profile',
    type: 'record',
    title: 'Employee Record: Elias Ward',
    timestamp: 'Archived',
    source: 'hr.nexora',
    content: [
      'NEXORA SYSTEMS — EMPLOYEE RECORD',
      '─────────────────────────────────',
      'NAME: Elias Ward',
      'POSITION: Senior Cloud Architect',
      'DEPARTMENT: Infrastructure Engineering',
      'STATUS: ■ TERMINATED',
      'START DATE: 2022-01-10',
      'END DATE: 2024-06-30',
      '',
      'NOTES:',
      '  Designed and built Nexora\'s core',
      '  cloud infrastructure. Departed under',
      '  undisclosed circumstances.',
      '',
      '  [RECORD PARTIALLY RESTRICTED]',
    ],
    discoveredIn: 'mission_04',
    significance: 'Elias departed "under undisclosed circumstances"',
  },

  // ---- Mission 05: Network investigation ----
  evt_sg_change: {
    id: 'evt_sg_change',
    type: 'audit',
    title: 'Security Group Modification',
    timestamp: '03:17:18 AM',
    source: 'ec2.security-groups',
    content: [
      'SECURITY GROUP: sg-0nexora-web-prod',
      'ACTION: AuthorizeSecurityGroupIngress',
      'USER: nexora-deploy-old',
      'TIME: 03:17:18 UTC',
      '',
      'RULE ADDED:',
      '  Protocol: TCP',
      '  Port: 22',
      '  Source: 0.0.0.0/0',
      '  Description: ""',
      '',
      'WARNING: SSH open to the world',
    ],
    discoveredIn: 'mission_05',
    significance: 'Elias\'s identity opened SSH access to the entire internet',
  },

  // ---- Mission 07: Database investigation ----
  evt_db_connection: {
    id: 'evt_db_connection',
    type: 'log',
    title: 'Unusual Database Connection',
    timestamp: '03:17:30 AM',
    source: 'rds.nexora-prod-db',
    content: [
      'CONNECTION LOG — nexora-prod-db',
      '─────────────────────────────────',
      'TIME: 03:17:30 UTC',
      'SOURCE: 198.51.100.47',
      'USER: nexora_app_admin',
      'DATABASE: nexora_production',
      'DURATION: 4m 23s',
      'QUERIES: 312',
      '',
      'QUERY PATTERN: Sequential table scans',
      'TABLES ACCESSED: users, transactions,',
      '  api_keys, system_config, audit_log',
      '',
      'NOTE: Same source IP as 03:17 events',
    ],
    discoveredIn: 'mission_07',
    significance: 'Someone systematically reading all production data at 03:17',
  },

  // ---- Mission 09: The incident ----
  evt_active_intrusion: {
    id: 'evt_active_intrusion',
    type: 'alert',
    title: 'ACTIVE CONFIGURATION CHANGE',
    timestamp: 'NOW',
    source: 'cloudtrail.realtime',
    content: [
      '⚠ REAL-TIME ALERT',
      '─────────────────────────────────',
      'MULTIPLE CONFIGURATION CHANGES DETECTED',
      '',
      '03:17:01 — ModifyInstanceAttribute (i-0a7f3c9d)',
      '03:17:04 — AuthorizeSecurityGroupIngress (sg-0nexora)',
      '03:17:08 — ModifyDBInstance (nexora-prod-db)',
      '03:17:12 — PutBucketPolicy (nexora-prod-assets)',
      '03:17:15 — CreateAccessKey (nexora-deploy-old)',
      '',
      'USER: nexora-deploy-old',
      'SOURCE IP: 198.51.100.47',
      '',
      'CHANGES ARE ONGOING',
    ],
    discoveredIn: 'mission_09',
    significance: 'Active intrusion — someone modifying infrastructure in real time',
  },

  // ---- Mission 10: The message ----
  evt_elias_message: {
    id: 'evt_elias_message',
    type: 'message',
    title: 'Internal Message',
    timestamp: 'Just now',
    source: 'nexora-internal',
    content: [
      'FROM: elias.ward@nexora.io',
      'TO: [PLAYER]',
      '',
      '"You should stop looking."',
    ],
    discoveredIn: 'mission_10',
    significance: 'Elias is watching. He knows the player is investigating.',
  },
};

export const getEvidence = (id) => EVIDENCE[id] || null;

export const getEvidenceByMission = (missionId) => {
  return Object.values(EVIDENCE).filter(e => e.discoveredIn === missionId);
};

export const getMysteryThread = () => {
  return Object.values(EVIDENCE)
    .filter(e => e.content.some(line =>
      line.includes('03:17') ||
      line.includes('nexora-deploy-old') ||
      line.includes('elias') ||
      line.includes('198.51.100.47')
    ))
    .sort((a, b) => {
      const order = ['mission_01','mission_02','mission_03','mission_04','mission_05','mission_07','mission_09','mission_10'];
      return order.indexOf(a.discoveredIn) - order.indexOf(b.discoveredIn);
    });
};

export default EVIDENCE;
