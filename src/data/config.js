/* ============================================
   LOST IN THE CLOUD — Game Configuration
   ============================================ */

const GAME_CONFIG = {
  // ---- Title & Branding ----
  title: 'LOST IN THE CLOUD',
  tagline: "You weren't hired to learn AWS. You were hired to keep the company alive.",
  version: '0.1.0',

  // ---- Company ----
  company: {
    name: 'NEXORA SYSTEMS',
    tagline: 'Cloud Infrastructure at Scale',
    departments: [
      'Infrastructure Engineering',
      'DevOps',
      'Security',
      'Product',
      'Data',
      'Customer Support',
      'Management',
    ],
  },

  // ---- Player Defaults ----
  playerDefaults: {
    department: 'Infrastructure Engineering',
    position: 'Junior Cloud Engineer',
    status: 'Active',
    startDay: 1,
  },

  // ---- Save System ----
  save: {
    storageKey: 'litc_save_data',
    autoSaveInterval: 30000, // 30 seconds
  },

  // ---- Cinematic ----
  cinematic: {
    textRevealSpeed: 40,      // ms per character
    sceneHoldDuration: 2500,  // ms to hold a scene card
    dialoguePause: 800,       // ms between dialogue lines
    fadeTransition: 800,      // ms for fade transitions
  },

  // ---- Terminal ----
  terminal: {
    prompt: 'nexora:cloud $',
    maxHistory: 100,
    maxOutputLines: 500,
    welcomeMessage: 'NEXORA SYSTEMS — Cloud Operations Terminal v2.4.1',
  },
};

export default GAME_CONFIG;
