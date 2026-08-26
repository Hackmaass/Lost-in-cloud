/* ============================================
   LOST IN THE CLOUD — Initial Cloud Infrastructure Seed
   ============================================
   Initial seed resources and mission fault states.
   ============================================ */

export const INITIAL_INFRASTRUCTURE = {
  // ---- Regions ----
  regions: ['us-east-1', 'ap-south-1', 'eu-west-1'],
  currentRegion: 'us-east-1',

  // ---- VPC & Networking ----
  vpcs: {
    'vpc-09923847291': {
      id: 'vpc-09923847291',
      name: 'nexora-prod-vpc',
      cidr: '10.0.0.0/16',
      region: 'us-east-1',
      status: 'available',
      igwId: 'igw-0a1b2c3d',
    },
  },

  subnets: {
    'subnet-pub-01': {
      id: 'subnet-pub-01',
      name: 'nexora-public-subnet-1a',
      vpcId: 'vpc-09923847291',
      cidr: '10.0.1.0/24',
      availabilityZone: 'us-east-1a',
      type: 'public',
      routeTableId: 'rtb-pub-01',
    },
    'subnet-priv-01': {
      id: 'subnet-priv-01',
      name: 'nexora-private-subnet-1a',
      vpcId: 'vpc-09923847291',
      cidr: '10.0.2.0/24',
      availabilityZone: 'us-east-1a',
      type: 'private',
      routeTableId: 'rtb-priv-01',
    },
  },

  // ---- Security Groups ----
  securityGroups: {
    'sg-0nexora-web-prod': {
      id: 'sg-0nexora-web-prod',
      name: 'nexora-web-security-group',
      vpcId: 'vpc-09923847291',
      description: 'Web tier security group for inbound HTTP/HTTPS traffic',
      inboundRules: [
        { protocol: 'TCP', port: 80, source: '0.0.0.0/0', description: 'HTTP web traffic' },
        { protocol: 'TCP', port: 443, source: '0.0.0.0/0', description: 'HTTPS web traffic' },
        { protocol: 'TCP', port: 22, source: '0.0.0.0/0', description: 'SSH administrative access [ANOMALOUS]' },
      ],
      outboundRules: [
        { protocol: 'ALL', port: 0, source: '0.0.0.0/0', description: 'Allow all outbound' },
      ],
    },
    'sg-0nexora-db-prod': {
      id: 'sg-0nexora-db-prod',
      name: 'nexora-db-security-group',
      vpcId: 'vpc-09923847291',
      description: 'Database tier security group for PostgreSQL',
      inboundRules: [
        { protocol: 'TCP', port: 5432, source: '10.0.1.0/24', description: 'PostgreSQL from Web Subnet' },
      ],
      outboundRules: [
        { protocol: 'ALL', port: 0, source: '0.0.0.0/0', description: 'Allow all outbound' },
      ],
    },
  },

  // ---- EC2 Compute ----
  instances: {
    'i-0a7f3c9d': {
      id: 'i-0a7f3c9d',
      name: 'nexora-web-prod-01',
      type: 't3.medium',
      region: 'us-east-1',
      subnetId: 'subnet-pub-01',
      securityGroups: ['sg-0nexora-web-prod'],
      status: 'running',
      health: 'healthy',
      publicIp: '54.210.88.12',
      privateIp: '10.0.1.15',
      metrics: { cpu: 24, memory: 45, networkIn: 180, networkOut: 420 },
      createdAt: '2024-01-10T08:00:00Z',
    },
    'i-0e8b2a1c': {
      id: 'i-0e8b2a1c',
      name: 'nexora-web-prod-02',
      type: 't3.medium',
      region: 'us-east-1',
      subnetId: 'subnet-pub-01',
      securityGroups: ['sg-0nexora-web-prod'],
      status: 'running',
      health: 'healthy',
      publicIp: '54.210.88.13',
      privateIp: '10.0.1.16',
      metrics: { cpu: 22, memory: 41, networkIn: 160, networkOut: 390 },
      createdAt: '2024-01-10T08:00:00Z',
    },
  },

  // ---- EBS Storage ----
  volumes: {
    'vol-09a8f7b6c5d4e3f21': {
      id: 'vol-09a8f7b6c5d4e3f21',
      name: 'nexora-web-root-vol',
      attachedInstance: 'i-0a7f3c9d',
      sizeGB: 20,
      usedGB: 6.2,
      availableGB: 13.8,
      usagePercent: 31,
      type: 'gp3',
      iops: 3000,
    },
  },

  // ---- S3 Object Storage ----
  buckets: {
    'nexora-prod-assets': {
      name: 'nexora-prod-assets',
      region: 'us-east-1',
      objectsCount: 847,
      sizeGB: 1.2,
      publicAccess: 'BlockAll',
      createdAt: '2024-02-01T10:00:00Z',
      objects: [],
    },
  },

  // ---- IAM Identities ----
  users: {
    'maya.chen': {
      name: 'maya.chen',
      attachedPolicies: ['ReadOnlyAccess', 'PowerUserAccess'],
      mfaEnabled: true,
      accessKeyId: 'AKIA9283749102834',
    },
    'arjun.mehta': {
      name: 'arjun.mehta',
      attachedPolicies: ['PowerUserAccess'],
      mfaEnabled: true,
      accessKeyId: 'AKIA4819203810293',
    },
    'lena.voss': {
      name: 'lena.voss',
      attachedPolicies: ['SecurityAudit', 'IAMFullAccess'],
      mfaEnabled: true,
      accessKeyId: 'AKIA7728193029182',
    },
    'nexora-deploy-old': {
      name: 'nexora-deploy-old',
      attachedPolicies: ['AdministratorAccess'],
      mfaEnabled: false,
      accessKeyId: 'AKIA0317429182736',
      createdBy: 'elias.ward@nexora.io',
    },
  },

  policies: {
    'AdministratorAccess': {
      name: 'AdministratorAccess',
      statements: [{ effect: 'Allow', action: ['*'], resource: '*' }],
    },
    'PowerUserAccess': {
      name: 'PowerUserAccess',
      statements: [{ effect: 'Allow', action: ['ec2:*', 's3:*', 'rds:*', 'cloudwatch:*'], resource: '*' }],
    },
    'ReadOnlyAccess': {
      name: 'ReadOnlyAccess',
      statements: [{ effect: 'Allow', action: ['*:Describe*', '*:Get*', '*:List*'], resource: '*' }],
    },
    'SecurityAudit': {
      name: 'SecurityAudit',
      statements: [{ effect: 'Allow', action: ['iam:*', 'cloudtrail:*', 'config:*'], resource: '*' }],
    },
  },

  // ---- Load Balancer ----
  loadBalancers: {
    'alb-nexora-prod': {
      id: 'alb-nexora-prod',
      name: 'nexora-prod-alb',
      region: 'us-east-1',
      dnsName: 'nexora-prod-alb-9283749.us-east-1.elb.amazonaws.com',
      scheme: 'internet-facing',
      vpcId: 'vpc-09923847291',
      targets: ['i-0a7f3c9d', 'i-0e8b2a1c'],
      healthyTargets: 2,
      unhealthyTargets: 0,
      healthStatus: 'healthy',
      listeners: [{ port: 80, protocol: 'HTTP' }, { port: 443, protocol: 'HTTPS' }],
    },
  },

  // ---- Auto Scaling ----
  autoScalingGroups: {
    'asg-nexora-prod': {
      id: 'asg-nexora-prod',
      name: 'nexora-web-asg',
      region: 'us-east-1',
      minSize: 2,
      maxSize: 4,
      desiredCapacity: 2,
      currentInstances: ['i-0a7f3c9d', 'i-0e8b2a1c'],
      targetLoadBalancer: 'alb-nexora-prod',
      instanceType: 't3.medium',
      subnetId: 'subnet-pub-01',
    },
  },

  // ---- RDS Database ----
  databases: {
    'nexora-prod-db': {
      id: 'nexora-prod-db',
      name: 'nexora-prod-db',
      engine: 'PostgreSQL 15.4',
      instanceClass: 'db.t3.medium',
      region: 'us-east-1',
      endpoint: 'nexora-prod-db.c98f219.us-east-1.rds.amazonaws.com:5432',
      status: 'available',
      health: 'healthy',
      storageGB: 100,
      multiAZ: false,
      metrics: { cpu: 32, connections: 85, latencyMs: 18 },
    },
  },
};

export default INITIAL_INFRASTRUCTURE;
