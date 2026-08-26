/* ============================================
   LOST IN THE CLOUD — Engineer Career Ranks
   ============================================ */

export const RANKS = [
  {
    id: 'intern',
    tier: 1,
    title: 'INTERN',
    minLevel: 1,
    minXP: 0,
    minMissions: 0,
    color: '#94a3b8',
    badge: '🌱',
    description: 'Newly inducted engineer getting oriented with cloud fundamentals.',
    responsibilities: 'Workstation setup, basic system status checks, following runbooks.',
  },
  {
    id: 'junior',
    tier: 2,
    title: 'JUNIOR CLOUD ENGINEER',
    minLevel: 2,
    minXP: 300,
    minMissions: 2,
    color: '#00d4ff',
    badge: '💻',
    description: 'Hands-on engineer capable of diagnosing basic compute and storage incidents.',
    responsibilities: 'EC2 instance troubleshooting, EBS volume management, incident triage.',
  },
  {
    id: 'engineer',
    tier: 3,
    title: 'CLOUD ENGINEER',
    minLevel: 5,
    minXP: 1000,
    minMissions: 4,
    color: '#00e676',
    badge: '⚡',
    description: 'Core infrastructure engineer managing VPC networking, IAM security, and databases.',
    responsibilities: 'Security Group audits, IAM policy least-privilege enforcement, RDS performance.',
  },
  {
    id: 'senior',
    tier: 4,
    title: 'SENIOR CLOUD ENGINEER',
    minLevel: 8,
    minXP: 2200,
    minMissions: 7,
    color: '#ff9900',
    badge: '🔥',
    description: 'Senior technical contributor designing scalable load-balanced architectures.',
    responsibilities: 'Auto Scaling configuration, traffic surge management, database query optimization.',
  },
  {
    id: 'staff',
    tier: 5,
    title: 'STAFF ENGINEER',
    minLevel: 12,
    minXP: 3800,
    minMissions: 9,
    color: '#a855f7',
    badge: '🛡',
    description: 'Technical authority leading critical incident response and infrastructure security.',
    responsibilities: 'Live intrusion mitigation, threat forensic analysis, architectural resilience.',
  },
  {
    id: 'architect',
    tier: 6,
    title: 'CLOUD ARCHITECT',
    minLevel: 15,
    minXP: 5500,
    minMissions: 10,
    color: '#f59e0b',
    badge: '👑',
    description: 'Master systems architect designing resilient, cost-efficient enterprise cloud solutions.',
    responsibilities: 'Multi-region disaster recovery, production service design, technical mentoring.',
  },
];

export function calculateRank(playerState) {
  const xp = playerState.xp || 0;
  const completedMissions = (playerState.completedMissions || []).length;
  const level = playerState.level || 1;

  let currentRank = RANKS[0];
  for (let i = RANKS.length - 1; i >= 0; i--) {
    const r = RANKS[i];
    if (level >= r.minLevel && xp >= r.minXP && completedMissions >= r.minMissions) {
      currentRank = r;
      break;
    }
  }

  const currentIndex = RANKS.findIndex(r => r.id === currentRank.id);
  const nextRank = currentIndex < RANKS.length - 1 ? RANKS[currentIndex + 1] : null;

  return {
    current: currentRank,
    next: nextRank,
    progressPercent: nextRank
      ? Math.min(100, Math.round(((xp - currentRank.minXP) / Math.max(1, nextRank.minXP - currentRank.minXP)) * 100))
      : 100,
  };
}

export default RANKS;
