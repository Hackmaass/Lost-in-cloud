/* ============================================
   LOST IN THE CLOUD — AI Mentor & Hint Engine
   ============================================
   3-tier progressive hints & conceptual explanations.
   Guiding question -> Service pointer -> Command suggestion.
   ============================================ */

export const MISSION_HINTS = {
  mission_01: {
    title: 'WELCOME TO NEXORA',
    level1: 'Your workstation is provisioned. What command was left on the sticky note?',
    level2: 'Look at the terminal at the bottom of your workstation.',
    level3: 'Run "system-status" to inspect production health, then "audit-log" to check recent events.',
  },
  mission_02: {
    title: "WHERE'S THE SERVER?",
    level1: 'Thousands of users cannot reach the website. Is the compute instance actually running?',
    level2: 'Check EC2 instances in us-east-1 to see if any host is in a stopped state.',
    level3: 'Run "describe-instances" or "ec2 list", then run "ec2 start i-0a7f3c9d" to restore the web server.',
  },
  mission_03: {
    title: 'DISK FULL',
    level1: 'Uploads are failing with 500 errors. What storage volume is holding application files?',
    level2: 'Inspect EBS disk usage to find which filesystem is saturated.',
    level3: 'Run "check-storage" to identify the full volume, then synchronize assets to S3 using "s3 sync /var/app/uploads s3://nexora-prod-assets".',
  },
  mission_04: {
    title: 'PERMISSION DENIED',
    level1: 'A legacy identity was detected in the audit logs. Does it have appropriate permissions?',
    level2: 'List all IAM users and inspect what policies are attached to nexora-deploy-old.',
    level3: 'Run "iam-users" or "iam list-users", then revoke excessive privileges using "iam revoke-policy nexora-deploy-old AdministratorAccess".',
  },
  mission_05: {
    title: 'THE NETWORK',
    level1: 'The API works internally but external users cannot connect. What firewall rules control inbound traffic?',
    level2: 'Inspect the web security group to see which ports and CIDR blocks are permitted.',
    level3: 'Run "describe-sg" or "sg list". Close unrestricted access with "sg revoke sg-0nexora-web-prod 22 0.0.0.0/0".',
  },
  mission_06: {
    title: 'TRAFFIC SPIKE',
    level1: 'Traffic surged 5x. Instead of just making one server huge, how do we distribute load across multiple smaller instances?',
    level2: 'Configure Auto Scaling to dynamically maintain between 2 and 6 instances behind the Load Balancer.',
    level3: 'Run "asg set-capacity asg-nexora-prod 2 6 3" to scale out horizontally with minimum cost impact.',
  },
  mission_07: {
    title: 'THE DATABASE',
    level1: 'Database queries are slow despite normal CPU. How many active connection pools are open?',
    level2: 'Inspect RDS metrics to identify external IP connection anomalies.',
    level3: 'Run "describe-rds" to inspect connection counts, then terminate unauthorized connections using "rds terminate-external nexora-prod-db".',
  },
  mission_08: {
    title: 'THE ARCHITECTURE REVIEW',
    level1: 'Inspect the full architecture on the ARCH MAP tab. What single points of failure exist in the database and security layers?',
    level2: 'Check if the RDS database has a Multi-AZ standby replica, and review IAM identity policies.',
    level3: 'Review the topology map in ARCH MAP and report single RDS instance & overprivileged IAM identities.',
  },
  mission_09: {
    title: 'THE INCIDENT',
    level1: 'Multiple systems are failing simultaneously while changes are occurring live. Who is executing them?',
    level2: 'Check CloudTrail logs in the terminal to identify the credentials being abused in real-time.',
    level3: 'Run "audit-log" or "logs", then rotate/revoke the compromised credentials using "iam rotate-keys nexora-deploy-old".',
  },
  mission_10: {
    title: 'FIRST DEPLOYMENT',
    level1: 'Design a resilient notification service architecture using private subnets, an Auto Scaling group, and an ALB.',
    level2: 'Select the balanced architecture option that avoids single points of failure while remaining cost-conscious.',
    level3: 'Deploy load-balanced instances in private subnets with least-privilege IAM roles.',
  },
};

export const CONCEPT_EXPLANATIONS = {
  EC2: 'Amazon Elastic Compute Cloud (EC2) provides resizable virtual servers. Instances can be launched, stopped, rebooted, or resized to fit computing demand.',
  EBS: 'Amazon Elastic Block Store (EBS) provides raw block-level storage volumes for EC2 instances, persisting independently from the instance lifecycle.',
  S3: 'Amazon Simple Storage Service (S3) is scalable object storage for files, media, and backups with 99.999999999% (11 9s) durability.',
  IAM: 'AWS Identity and Access Management (IAM) securely manages identities (users, roles) and permissions (policies) to follow the Principle of Least Privilege.',
  VPC: 'Amazon Virtual Private Cloud (VPC) provisions an isolated virtual network where subnets, route tables, and gateways define traffic boundaries.',
  'Security Groups': 'Virtual firewalls associated with EC2 instances that control inbound and outbound traffic at the protocol and port level.',
  'Load Balancing': 'Elastic Load Balancing (ALB) automatically distributes incoming application traffic across multiple healthy targets across Availability Zones.',
  'Auto Scaling': 'AWS Auto Scaling automatically adjusts compute capacity up or down based on predefined target metrics like CPU utilization.',
  RDS: 'Amazon Relational Database Service (RDS) automates database provisioning, patching, backups, and replication for engines like PostgreSQL and MySQL.',
  CloudWatch: 'A comprehensive monitoring and observability service that collects metrics, alarms, and structured log events from every AWS resource.',
};

export class MentorEngine {
  static getHint(missionId, hintLevel = 1) {
    const mission = MISSION_HINTS[missionId] || MISSION_HINTS.mission_01;
    if (hintLevel === 1) return { level: 1, text: mission.level1, title: mission.title };
    if (hintLevel === 2) return { level: 2, text: mission.level2, title: mission.title };
    return { level: 3, text: mission.level3, title: mission.title };
  }

  static explainConcept(conceptName) {
    return CONCEPT_EXPLANATIONS[conceptName] || `Concept information for ${conceptName}.`;
  }
}

export default MentorEngine;
