/* ============================================
   LOST IN THE CLOUD — 11 Engineering Skill Domains
   ============================================ */

export const SKILL_DOMAINS = [
  {
    id: 'compute',
    name: 'COMPUTE & INSTANCES',
    icon: '💻',
    color: '#00d4ff',
    description: 'EC2 instance lifecycle, instance sizing, compute virtualization, and host troubleshooting.',
    concepts: ['EC2', 'Instances', 'Instance States', 'Instance Types'],
    missionsUsed: ['mission_01', 'mission_02', 'mission_06', 'mission_10'],
    strengths: 'Rapid instance recovery and compute state identification.',
    nextMilestone: 'Heterogeneous compute architectures and Graviton optimization.',
  },
  {
    id: 'storage',
    name: 'STORAGE SYSTEMS',
    icon: '🪣',
    color: '#38bdf8',
    description: 'EBS block storage volumes, IOPS provisioning, and S3 scalable object storage lifecycle.',
    concepts: ['EBS', 'Volumes', 'S3', 'Object Storage'],
    missionsUsed: ['mission_03', 'mission_04', 'mission_08'],
    strengths: 'Offloading local storage pressure to highly durable object storage.',
    nextMilestone: 'S3 Intelligent-Tiering and cross-region replication.',
  },
  {
    id: 'networking',
    name: 'VPC & NETWORKING',
    icon: '🌐',
    color: '#00e676',
    description: 'Virtual Private Cloud boundaries, public/private subnets, route tables, and Internet Gateways.',
    concepts: ['VPC', 'Subnets', 'Internet Gateway', 'Route Tables'],
    missionsUsed: ['mission_05', 'mission_08', 'mission_10'],
    strengths: 'Network isolation and public-to-private routing topologies.',
    nextMilestone: 'VPC Peering, Transit Gateways, and PrivateLink endpoints.',
  },
  {
    id: 'security',
    name: 'SECURITY & IAM',
    icon: '🛡',
    color: '#ef4444',
    description: 'Identity & Access Management, least privilege policies, key rotation, and Security Group firewalls.',
    concepts: ['IAM', 'Policies', 'Least Privilege', 'Security Groups'],
    missionsUsed: ['mission_04', 'mission_05', 'mission_08', 'mission_09'],
    strengths: 'Auditing excessive permissions and closing unrestricted firewall ports.',
    nextMilestone: 'IAM Permission Boundaries, SCPs, and KMS encryption.',
  },
  {
    id: 'databases',
    name: 'DATABASE SYSTEMS',
    icon: '🗄',
    color: '#f59e0b',
    description: 'RDS relational database management, PostgreSQL connection pools, latency, and read replicas.',
    concepts: ['RDS', 'Database Management', 'Connections', 'Query Optimization'],
    missionsUsed: ['mission_07', 'mission_08'],
    strengths: 'Diagnosing external connection saturation and query latency.',
    nextMilestone: 'Multi-AZ automated failover and Aurora Serverless clusters.',
  },
  {
    id: 'serverless',
    name: 'SERVERLESS COMPUTING',
    icon: '⚡',
    color: '#a855f7',
    description: 'Event-driven compute, AWS Lambda functions, API Gateway, and asynchronous microservices.',
    concepts: ['Lambda', 'API Gateway', 'Event-Driven', 'Serverless'],
    missionsUsed: ['mission_10'],
    strengths: 'Zero-idle compute scaling and decoupled event triggers.',
    nextMilestone: 'Step Functions workflows and EventBridge routing.',
  },
  {
    id: 'devops',
    name: 'DEVOPS & DEPLOYMENT',
    icon: '🚀',
    color: '#ec4899',
    description: 'Automated CI/CD pipelines, zero-downtime rolling deployments, and automated rollbacks.',
    concepts: ['Deployment', 'CI/CD', 'Automated Rollback'],
    missionsUsed: ['mission_02', 'mission_10'],
    strengths: 'Immutable infrastructure deployment and credential rotation.',
    nextMilestone: 'Infrastructure as Code with AWS CDK and Terraform.',
  },
  {
    id: 'observability',
    name: 'OBSERVABILITY & MONITORING',
    icon: '📊',
    color: '#06b6d4',
    description: 'CloudWatch metrics, structured log analysis, alarm thresholds, and distributed tracing.',
    concepts: ['CloudWatch', 'Monitoring', 'Incident Response', 'Logs'],
    missionsUsed: ['mission_01', 'mission_07', 'mission_09'],
    strengths: 'Forensic audit analysis and identifying anomaly patterns.',
    nextMilestone: 'Custom CloudWatch metric filters and AWS X-Ray service maps.',
  },
  {
    id: 'reliability',
    name: 'RELIABILITY & SCALING',
    icon: '⚖',
    color: '#10b981',
    description: 'Application Load Balancers, Auto Scaling groups, health check probes, and fault isolation.',
    concepts: ['Load Balancing', 'Auto Scaling', 'Horizontal Scaling', 'Availability'],
    missionsUsed: ['mission_06', 'mission_08', 'mission_10'],
    strengths: 'Dynamic horizontal scaling behind health-checked load balancers.',
    nextMilestone: 'Chaos engineering and multi-region disaster recovery.',
  },
  {
    id: 'cost',
    name: 'COST OPTIMIZATION',
    icon: '💰',
    color: '#84cc16',
    description: 'Cloud economics, resource rightsizing, auto-scaling efficiency, and billing optimization.',
    concepts: ['Cost Optimization', 'Rightsizing', 'Resource Efficiency'],
    missionsUsed: ['mission_03', 'mission_06', 'mission_10'],
    strengths: 'Avoiding single over-provisioned compute ceilings.',
    nextMilestone: 'AWS Savings Plans, Spot instance fleets, and Cost Explorer.',
  },
  {
    id: 'architecture',
    name: 'SYSTEMS ARCHITECTURE',
    icon: '🏛',
    color: '#fbbf24',
    description: 'Multi-tier system design, Single Point of Failure elimination, and Well-Architected reviews.',
    concepts: ['Architecture', 'Well-Architected Framework', 'Reliability'],
    missionsUsed: ['mission_08', 'mission_10'],
    strengths: 'Holistic system mapping and dependency risk mitigation.',
    nextMilestone: 'High-volume distributed event streaming architectures.',
  },
];

export function getPlayerSkills(unlockedConcepts = [], completedMissions = []) {
  return SKILL_DOMAINS.map(domain => {
    const matchingConcepts = domain.concepts.filter(c => unlockedConcepts.includes(c));
    const matchingMissions = domain.missionsUsed.filter(m => completedMissions.includes(m));

    const level = Math.min(5, Math.max(1, matchingConcepts.length + Math.floor(matchingMissions.length / 2)));
    const percent = Math.min(100, Math.round((matchingConcepts.length / domain.concepts.length) * 100));

    return {
      ...domain,
      level,
      percent: Math.max(15, percent),
      unlockedCount: matchingConcepts.length,
      totalCount: domain.concepts.length,
    };
  });
}

export default SKILL_DOMAINS;
