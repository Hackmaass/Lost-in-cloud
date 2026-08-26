/* ============================================
   LOST IN THE CLOUD — Achievement Registry
   ============================================ */

export const ACHIEVEMENTS = [
  {
    id: 'first_response',
    title: 'FIRST RESPONSE',
    category: 'operations',
    rarity: 'Common',
    icon: '🚨',
    xp: 150,
    description: 'Resolve your first live production incident at Nexora Systems.',
    condition: (state) => state.completedMissions?.includes('mission_02'),
  },
  {
    id: 'least_privilege',
    title: 'LEAST PRIVILEGE',
    category: 'security',
    rarity: 'Rare',
    icon: '🛡',
    xp: 200,
    description: 'Uncover and restrict an overly permissive legacy IAM credential.',
    condition: (state) => state.storyFlags?.includes('found_admin_access') || state.completedMissions?.includes('mission_04'),
  },
  {
    id: 'zero_downtime',
    title: 'ZERO DOWNTIME',
    category: 'reliability',
    rarity: 'Epic',
    icon: '⚡',
    xp: 300,
    description: 'Scale production horizontally during a major traffic surge without dropping requests.',
    condition: (state) => state.storyFlags?.includes('chose_scale_out') || state.completedMissions?.includes('mission_06'),
  },
  {
    id: 'cost_cutter',
    title: 'COST CUTTER',
    category: 'cost',
    rarity: 'Rare',
    icon: '💰',
    xp: 200,
    description: 'Design a high-efficiency architecture that minimizes unnecessary cloud spend.',
    condition: (state) => state.storyFlags?.includes('efficient_solution') || state.storyFlags?.includes('chose_s3_solution'),
  },
  {
    id: 'forensic',
    title: 'FORENSIC INVESTIGATOR',
    category: 'investigation',
    rarity: 'Epic',
    icon: '🔍',
    xp: 250,
    description: 'Discover the recurring 03:17 AM unauthorized audit trail across multiple subsystems.',
    condition: (state) => state.storyFlags?.includes('connected_all_evidence') || state.storyFlags?.includes('found_0317_database'),
  },
  {
    id: 'night_shift',
    title: 'NIGHT SHIFT',
    category: 'operations',
    rarity: 'Rare',
    icon: '🌙',
    xp: 300,
    description: 'Contain a live multi-system intrusion and rotate compromised production credentials.',
    condition: (state) => state.completedMissions?.includes('mission_09'),
  },
  {
    id: 'architect',
    title: 'CLOUD ARCHITECT',
    category: 'architecture',
    rarity: 'Legendary',
    icon: '👑',
    xp: 500,
    description: 'Design and deploy a resilient multi-tier cloud service and complete Act I.',
    condition: (state) => state.completedMissions?.includes('mission_10') || state.storyFlags?.includes('act_1_complete'),
  },
  {
    id: 'no_panic',
    title: 'NO PANIC',
    category: 'operations',
    rarity: 'Common',
    icon: '🧊',
    xp: 100,
    description: 'Investigate system logs and identify stopped compute state before jumping to conclusions.',
    condition: (state) => state.storyFlags?.includes('chose_investigate_first'),
  },
  {
    id: 'cloud_scholar',
    title: 'CLOUD SCHOLAR',
    category: 'learning',
    rarity: 'Rare',
    icon: '📜',
    xp: 250,
    description: 'Unlock 8 or more core AWS cloud architectural concepts.',
    condition: (state) => (state.unlockedConcepts || []).length >= 8,
  },
  {
    id: 'community_builder',
    title: 'COMMUNITY BUILDER',
    category: 'club',
    rarity: 'Epic',
    icon: '🤝',
    xp: 350,
    description: 'Participate in the AWS Cloud Club by registering for a workshop or submitting a project.',
    condition: (state) => (state.registeredEvents || []).length > 0 || (state.clubProjects || []).length > 0,
  },
];

export function evaluateAchievements(state) {
  const currentUnlocked = state.achievements || [];
  const newlyUnlocked = [];

  ACHIEVEMENTS.forEach(ach => {
    if (!currentUnlocked.includes(ach.id) && !currentUnlocked.includes(ach.title)) {
      if (ach.condition(state)) {
        newlyUnlocked.push(ach);
      }
    }
  });

  return newlyUnlocked;
}

export default ACHIEVEMENTS;
