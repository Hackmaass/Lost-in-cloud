/* ============================================
   LOST IN THE CLOUD — Character Definitions
   ============================================ */

export const CHARACTERS = {
  maya: {
    id: 'maya',
    name: 'Maya Chen',
    title: 'Engineering Manager',
    department: 'Infrastructure Engineering',
    personality: ['calm', 'intelligent', 'demanding', 'observant'],
    description: 'Runs Infrastructure Engineering. Assigns missions and evaluates decisions. Appears to know more about Nexora\'s history than she initially reveals.',
    dialogueStyle: 'Direct, measured, deliberate pauses. Says more with silence than words.',
    accentColor: '#00d4ff',
  },

  arjun: {
    id: 'arjun',
    name: 'Arjun Mehta',
    title: 'Senior Cloud Engineer',
    department: 'Infrastructure Engineering',
    personality: ['brilliant', 'sarcastic', 'pragmatic', 'approachable'],
    description: 'The player\'s primary technical mentor. Teaches through questions rather than lectures. Technically brilliant with a dry wit.',
    dialogueStyle: 'Sharp, slightly amused, leads with questions. Never explains when he can make you discover.',
    accentColor: '#ff9900',
  },

  lena: {
    id: 'lena',
    name: 'Lena Voss',
    title: 'Security Engineer',
    department: 'Security',
    personality: ['precise', 'skeptical', 'intimidating', 'principled'],
    description: 'Challenges dangerous assumptions. Will eventually introduce security, permissions and risk. Intimidating without being theatrical.',
    dialogueStyle: 'Clipped, precise, skeptical. Asks questions that make you doubt your own answers.',
    accentColor: '#ff3b3b',
  },

  daniel: {
    id: 'daniel',
    name: 'Daniel Reyes',
    title: 'DevOps Engineer',
    department: 'DevOps',
    personality: ['energetic', 'funny', 'fast-moving', 'occasionally careless'],
    description: 'Provides infrastructure context and lighter moments. Energetic and fast-moving, occasionally careless.',
    dialogueStyle: 'Casual, quick, punctuated with humor. Talks fast, sometimes too fast.',
    accentColor: '#00e676',
  },

  elias: {
    id: 'elias',
    name: 'Elias Ward',
    title: 'Former Cloud Architect',
    department: 'Infrastructure Engineering',
    personality: ['brilliant', 'meticulous', 'secretive', 'methodical'],
    description: 'Former Nexora engineer who left two years ago. Built most of the original infrastructure. Never appears in person — only through system logs, ghost credentials, and one final message.',
    dialogueStyle: 'Terse, precise, unsettling. Communicates through systems rather than words.',
    accentColor: '#a855f7',
  },

  system: {
    id: 'system',
    name: 'NEXORA SYSTEMS',
    title: 'Internal Network',
    department: 'System',
    personality: [],
    description: 'System-generated messages, alerts, and notifications.',
    dialogueStyle: 'Formal, mechanical, terse.',
    accentColor: '#5a5a72',
  },
};

export const getCharacter = (id) => CHARACTERS[id] || CHARACTERS.system;
export const getCharacterName = (id) => getCharacter(id).name;
export const getCharacterColor = (id) => getCharacter(id).accentColor;

export default CHARACTERS;
