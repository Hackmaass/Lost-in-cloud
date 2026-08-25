/* ============================================
   LOST IN THE CLOUD — Act I: The New Hire
   ============================================ */

const ACT_1 = {
  id: 'act1',
  title: 'THE NEW HIRE',
  description: 'Your first week at Nexora Systems. Learn the systems, meet the team, and survive your first incidents.',

  missions: [
    // ========================================
    // MISSION 01 — WELCOME TO NEXORA
    // ========================================
    {
      id: 'mission_01',
      title: 'WELCOME TO NEXORA',
      number: '01',
      description: 'Your first day at Nexora Systems. Meet your team and get oriented.',
      status: 'available',
      objectives: [
        { id: 'obj_01_1', text: 'Report to Infrastructure Engineering', completed: false },
        { id: 'obj_01_2', text: 'Meet your manager', completed: false },
        { id: 'obj_01_3', text: 'Access your workstation', completed: false },
        { id: 'obj_01_4', text: 'Run your first system check', completed: false },
        { id: 'obj_01_5', text: 'Meet the team', completed: false },
      ],
      xpReward: 100,

      scenes: [
        // ---- Scene 1: Maya's Welcome ----
        {
          id: 'scene_01_1',
          type: 'dialogue',
          character: 'maya',
          objectiveComplete: 'obj_01_2',
          dialogue: [
            { speaker: 'maya', text: "Welcome to Infrastructure.", pause: 600 },
            { speaker: 'maya', text: "I'm Maya. I run this department.", pause: 400 },
            { speaker: 'maya', text: "You've joined at an interesting time.", pause: 800 },
            { speaker: 'maya', text: "Nexora is growing fast. Faster than our infrastructure can keep up.", pause: 600 },
            { speaker: 'maya', text: "That's where you come in.", pause: 400 },
            { speaker: 'maya', text: "I don't need you to know everything.", pause: 600 },
            { speaker: 'maya', text: "I need you to figure things out.", pause: 800 },
            { speaker: 'maya', text: "Your workstation is ready. Get settled.", pause: 400 },
            { speaker: 'maya', text: "Then I'll introduce you to someone who can show you how things actually work around here.", pause: 0 },
          ],
        },

        // ---- Scene 2: Workstation Access ----
        {
          id: 'scene_01_2',
          type: 'narrative',
          objectiveComplete: 'obj_01_3',
          text: [
            'You sit down at the workstation.',
            'Three monitors. Dark theme. Terminal already open.',
            'A sticky note on the monitor reads:',
            '"system-status — run this first. — A"',
          ],
          action: {
            type: 'terminal_hint',
            command: 'system-status',
            hint: 'Try running system-status in the terminal below.',
          },
        },

        // ---- Scene 3: First System Check ----
        {
          id: 'scene_01_3',
          type: 'terminal_task',
          objectiveComplete: 'obj_01_4',
          requiredCommand: 'system-status',
          onComplete: {
            type: 'dialogue',
            character: 'arjun',
            dialogue: [
              { speaker: 'arjun', text: "You found the sticky note.", pause: 400 },
              { speaker: 'arjun', text: "Good. I'm Arjun.", pause: 300 },
              { speaker: 'arjun', text: "Senior Cloud Engineer. Your unofficial guide to not breaking everything.", pause: 600 },
              { speaker: 'arjun', text: "That status board you just pulled up? That's our production environment.", pause: 400 },
              { speaker: 'arjun', text: "Everything looks green right now.", pause: 800 },
              { speaker: 'arjun', text: "Enjoy that. It doesn't last.", pause: 600 },
            ],
          },
        },

        // ---- Scene 4: Meet the Team ----
        {
          id: 'scene_01_4',
          type: 'dialogue',
          character: 'arjun',
          objectiveComplete: 'obj_01_5',
          dialogue: [
            { speaker: 'arjun', text: "Let me tell you who matters around here.", pause: 400 },
            { speaker: 'arjun', text: "Maya — you met her. Runs infrastructure. Smart. Watches everything.", pause: 400 },
            { speaker: 'arjun', text: "Lena Voss — Security. She'll question every decision you make. That's her job.", pause: 400 },
            { speaker: 'arjun', text: "Daniel Reyes — DevOps. Moves fast. Breaks things. Fixes them faster.", pause: 400 },
            { speaker: 'arjun', text: "And me. I keep the cloud from falling.", pause: 600 },
            { speaker: 'arjun', text: "Any questions? Good. Because Maya's already got something for you.", pause: 0 },
          ],
          storyFlags: ['met_team', 'arjun_introduced', 'lena_mentioned', 'daniel_mentioned'],
        },

        // ---- Scene 5: Mission Complete ----
        {
          id: 'scene_01_5',
          type: 'mission_complete',
          title: 'MISSION COMPLETE',
          subtitle: 'Welcome to Nexora',
          message: 'You\'ve met the team and accessed your workstation. Day one is behind you.',
          xp: 100,
          unlocks: ['cloud_concepts_intro'],
          nextMission: 'mission_02',
        },
      ],
    },

    // ========================================
    // MISSIONS 02-10 — STUBS
    // ========================================
    {
      id: 'mission_02',
      title: "WHERE'S THE SERVER?",
      number: '02',
      description: 'A critical service is unreachable. Find the machine serving the website.',
      status: 'locked',
      objectives: [
        { id: 'obj_02_1', text: 'Investigate the outage report', completed: false },
        { id: 'obj_02_2', text: 'Locate the EC2 instance', completed: false },
        { id: 'obj_02_3', text: 'Verify the instance state', completed: false },
        { id: 'obj_02_4', text: 'Report findings to Maya', completed: false },
      ],
      xpReward: 150,
      scenes: [],
      awsConcepts: ['EC2', 'Instances', 'Instance States'],
    },

    {
      id: 'mission_03',
      title: 'DISK FULL',
      number: '03',
      description: 'An application is failing to write data. The storage has run out.',
      status: 'locked',
      objectives: [],
      xpReward: 175,
      scenes: [],
      awsConcepts: ['EBS', 'Volumes', 'Storage'],
    },

    {
      id: 'mission_04',
      title: 'PERMISSION DENIED',
      number: '04',
      description: "You need access to a resource — but you don't have it. Who controls the keys?",
      status: 'locked',
      objectives: [],
      xpReward: 200,
      scenes: [],
      awsConcepts: ['IAM', 'Policies', 'Roles'],
    },

    {
      id: 'mission_05',
      title: 'THE NETWORK',
      number: '05',
      description: 'Two services that need to communicate cannot reach each other.',
      status: 'locked',
      objectives: [],
      xpReward: 225,
      scenes: [],
      awsConcepts: ['VPC', 'Subnets', 'Security Groups'],
    },

    {
      id: 'mission_06',
      title: 'TRAFFIC SPIKE',
      number: '06',
      description: 'User traffic surges and the system starts to buckle.',
      status: 'locked',
      objectives: [],
      xpReward: 250,
      scenes: [],
      awsConcepts: ['Load Balancing', 'Auto Scaling'],
    },

    {
      id: 'mission_07',
      title: 'THE DATABASE',
      number: '07',
      description: 'The application database is showing signs of strain.',
      status: 'locked',
      objectives: [],
      xpReward: 275,
      scenes: [],
      awsConcepts: ['RDS', 'Database Management'],
    },

    {
      id: 'mission_08',
      title: 'THE ARCHITECTURE REVIEW',
      number: '08',
      description: 'Maya wants you to review the full system architecture. What do you see?',
      status: 'locked',
      objectives: [],
      xpReward: 300,
      scenes: [],
      awsConcepts: ['Architecture', 'Well-Architected Framework'],
    },

    {
      id: 'mission_09',
      title: 'THE INCIDENT',
      number: '09',
      description: 'A major production incident. All hands on deck.',
      status: 'locked',
      objectives: [],
      xpReward: 400,
      scenes: [],
      awsConcepts: ['CloudWatch', 'Monitoring', 'Incident Response'],
    },

    {
      id: 'mission_10',
      title: 'FIRST DEPLOYMENT',
      number: '10',
      description: 'Deploy a new service to production. No pressure.',
      status: 'locked',
      objectives: [],
      xpReward: 500,
      scenes: [],
      awsConcepts: ['Deployment', 'CI/CD', 'Lambda'],
    },
  ],
};

export default ACT_1;
