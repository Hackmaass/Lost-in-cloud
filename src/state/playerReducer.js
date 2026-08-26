/* ============================================
   LOST IN THE CLOUD — Player State Reducer
   ============================================ */

export const GAME_PHASES = {
  LANDING: 'landing',
  PLAYER_CREATION: 'player_creation',
  CINEMATIC_INTRO: 'cinematic_intro',
  GAMEPLAY: 'gameplay',
};

export const initialPlayerState = {
  // ---- Identity ----
  name: '',
  displayName: '',
  avatar: null,

  // ---- Role ----
  department: 'Infrastructure Engineering',
  position: 'Junior Cloud Engineer',
  status: 'Active',

  // ---- Game Phase ----
  gamePhase: GAME_PHASES.LANDING,

  // ---- Progression ----
  currentAct: 'act1',
  currentMission: 'mission_01',
  currentScene: 'scene_01_1',
  currentObjectiveIndex: 0,
  day: 1,

  // ---- Completed ----
  completedMissions: [],
  completedObjectives: [],
  completedScenes: [],

  // ---- Story ----
  storyFlags: [],
  decisions: [],
  discoveredInfo: [],

  // ---- Progression Stats ----
  xp: 0,
  clubXp: 450,
  level: 1,
  skills: {},
  achievements: [],
  unlockedConcepts: [],

  // ---- AWS Cloud Club ----
  registeredEvents: ['evt_serverless_night'],
  completedChallenges: [],
  clubProjects: [],

  // ---- Messages ----
  messages: [],
  unreadMessages: 0,

  // ---- Terminal ----
  terminalHistory: [],

  // ---- Mission Ratings & Investigation ----
  missionRatings: {},
  investigationState: {},

  // ---- Meta ----
  createdAt: null,
  lastSaved: null,
  totalPlayTime: 0,
};

// ---- Action Types ----
export const ACTION_TYPES = {
  SET_PLAYER_IDENTITY: 'SET_PLAYER_IDENTITY',
  SET_GAME_PHASE: 'SET_GAME_PHASE',
  ADVANCE_SCENE: 'ADVANCE_SCENE',
  COMPLETE_OBJECTIVE: 'COMPLETE_OBJECTIVE',
  COMPLETE_SCENE: 'COMPLETE_SCENE',
  COMPLETE_MISSION: 'COMPLETE_MISSION',
  SET_STORY_FLAG: 'SET_STORY_FLAG',
  SET_STORY_FLAGS: 'SET_STORY_FLAGS',
  MAKE_DECISION: 'MAKE_DECISION',
  ADD_XP: 'ADD_XP',
  ADD_CLUB_XP: 'ADD_CLUB_XP',
  UNLOCK_CONCEPT: 'UNLOCK_CONCEPT',
  UNLOCK_CONCEPTS: 'UNLOCK_CONCEPTS',
  UNLOCK_ACHIEVEMENT: 'UNLOCK_ACHIEVEMENT',
  REGISTER_EVENT: 'REGISTER_EVENT',
  UNREGISTER_EVENT: 'UNREGISTER_EVENT',
  SUBMIT_CHALLENGE: 'SUBMIT_CHALLENGE',
  PUBLISH_PROJECT: 'PUBLISH_PROJECT',
  ADD_MESSAGE: 'ADD_MESSAGE',
  MARK_MESSAGES_READ: 'MARK_MESSAGES_READ',
  ADD_TERMINAL_ENTRY: 'ADD_TERMINAL_ENTRY',
  CLEAR_TERMINAL: 'CLEAR_TERMINAL',
  LOAD_STATE: 'LOAD_STATE',
  INCREMENT_DAY: 'INCREMENT_DAY',
  SET_DAY: 'SET_DAY',
  DISCOVER_INFO: 'DISCOVER_INFO',
  ADD_SKILL: 'ADD_SKILL',
  SET_MISSION_RATING: 'SET_MISSION_RATING',
  UPDATE_INVESTIGATION: 'UPDATE_INVESTIGATION',
};

export function playerReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_PLAYER_IDENTITY:
      return {
        ...state,
        name: action.payload.name,
        displayName: action.payload.displayName,
        avatar: action.payload.avatar || null,
        createdAt: new Date().toISOString(),
      };

    case ACTION_TYPES.SET_GAME_PHASE:
      return { ...state, gamePhase: action.payload };

    case ACTION_TYPES.ADVANCE_SCENE:
      return {
        ...state,
        currentScene: action.payload.sceneId,
        currentMission: action.payload.missionId || state.currentMission,
      };

    case ACTION_TYPES.COMPLETE_OBJECTIVE:
      if (state.completedObjectives.includes(action.payload)) return state;
      return {
        ...state,
        completedObjectives: [...state.completedObjectives, action.payload],
      };

    case ACTION_TYPES.COMPLETE_SCENE:
      if (state.completedScenes.includes(action.payload)) return state;
      return {
        ...state,
        completedScenes: [...state.completedScenes, action.payload],
      };

    case ACTION_TYPES.COMPLETE_MISSION: {
      if (state.completedMissions.includes(action.payload.missionId)) return state;
      return {
        ...state,
        completedMissions: [...state.completedMissions, action.payload.missionId],
        currentMission: action.payload.nextMission || state.currentMission,
        currentScene: action.payload.nextScene || state.currentScene,
      };
    }

    case ACTION_TYPES.SET_STORY_FLAG:
      if (state.storyFlags.includes(action.payload)) return state;
      return {
        ...state,
        storyFlags: [...state.storyFlags, action.payload],
      };

    case ACTION_TYPES.SET_STORY_FLAGS: {
      const newFlags = action.payload.filter(f => !state.storyFlags.includes(f));
      if (newFlags.length === 0) return state;
      return {
        ...state,
        storyFlags: [...state.storyFlags, ...newFlags],
      };
    }

    case ACTION_TYPES.MAKE_DECISION:
      return {
        ...state,
        decisions: [...state.decisions, {
          ...action.payload,
          timestamp: new Date().toISOString(),
        }],
      };

    case ACTION_TYPES.ADD_XP: {
      const newXp = state.xp + action.payload;
      const newLevel = Math.floor(newXp / 500) + 1;
      return { ...state, xp: newXp, level: newLevel };
    }

    case ACTION_TYPES.ADD_CLUB_XP:
      return {
        ...state,
        clubXp: (state.clubXp || 0) + action.payload,
      };

    case ACTION_TYPES.REGISTER_EVENT:
      if ((state.registeredEvents || []).includes(action.payload)) return state;
      return {
        ...state,
        registeredEvents: [...(state.registeredEvents || []), action.payload],
        clubXp: (state.clubXp || 0) + 50, // RSVP bonus
      };

    case ACTION_TYPES.UNREGISTER_EVENT:
      return {
        ...state,
        registeredEvents: (state.registeredEvents || []).filter(eId => eId !== action.payload),
      };

    case ACTION_TYPES.SUBMIT_CHALLENGE:
      return {
        ...state,
        completedChallenges: [...(state.completedChallenges || []), action.payload.challengeId],
        clubXp: (state.clubXp || 0) + (action.payload.points || 200),
      };

    case ACTION_TYPES.PUBLISH_PROJECT:
      return {
        ...state,
        clubProjects: [...(state.clubProjects || []), action.payload],
        clubXp: (state.clubXp || 0) + 300,
      };

    case ACTION_TYPES.UNLOCK_CONCEPT:
      if (state.unlockedConcepts.includes(action.payload)) return state;
      return {
        ...state,
        unlockedConcepts: [...state.unlockedConcepts, action.payload],
      };

    case ACTION_TYPES.UNLOCK_CONCEPTS: {
      const toAdd = action.payload.filter(c => !state.unlockedConcepts.includes(c));
      if (toAdd.length === 0) return state;
      return {
        ...state,
        unlockedConcepts: [...state.unlockedConcepts, ...toAdd],
      };
    }

    case ACTION_TYPES.UNLOCK_ACHIEVEMENT:
      if (state.achievements.includes(action.payload)) return state;
      return {
        ...state,
        achievements: [...state.achievements, action.payload],
      };

    case ACTION_TYPES.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, {
          ...action.payload,
          id: `msg_${Date.now()}`,
          timestamp: new Date().toISOString(),
          read: false,
        }],
        unreadMessages: state.unreadMessages + 1,
      };

    case ACTION_TYPES.MARK_MESSAGES_READ:
      return {
        ...state,
        messages: state.messages.map(m => ({ ...m, read: true })),
        unreadMessages: 0,
      };

    case ACTION_TYPES.ADD_TERMINAL_ENTRY:
      return {
        ...state,
        terminalHistory: [...state.terminalHistory, {
          ...action.payload,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        }],
      };

    case ACTION_TYPES.CLEAR_TERMINAL:
      return { ...state, terminalHistory: [] };

    case ACTION_TYPES.LOAD_STATE:
      return { ...action.payload };

    case ACTION_TYPES.INCREMENT_DAY:
      return { ...state, day: state.day + 1 };

    case ACTION_TYPES.SET_DAY:
      return { ...state, day: action.payload };

    case ACTION_TYPES.DISCOVER_INFO:
      if (state.discoveredInfo.includes(action.payload)) return state;
      return {
        ...state,
        discoveredInfo: [...state.discoveredInfo, action.payload],
      };

    case ACTION_TYPES.ADD_SKILL:
      return {
        ...state,
        skills: {
          ...state.skills,
          [action.payload.skill]: (state.skills[action.payload.skill] || 0) + action.payload.amount,
        },
      };

    case ACTION_TYPES.SET_MISSION_RATING:
      return {
        ...state,
        missionRatings: {
          ...state.missionRatings,
          [action.payload.missionId]: action.payload.ratings,
        },
      };

    case ACTION_TYPES.UPDATE_INVESTIGATION:
      return {
        ...state,
        investigationState: {
          ...state.investigationState,
          ...action.payload,
        },
      };

    default:
      return state;
  }
}

export default playerReducer;
