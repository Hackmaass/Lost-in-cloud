/* ============================================
   LOST IN THE CLOUD — Game Context Provider
   ============================================ */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { playerReducer, initialPlayerState, ACTION_TYPES, GAME_PHASES } from './playerReducer';
import SaveManager from '../engine/SaveManager';
import GAME_CONFIG from '../data/config';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(playerReducer, initialPlayerState, () => {
    // Try to load saved state on initialization
    const saved = SaveManager.load();
    if (saved) {
      return { ...initialPlayerState, ...saved };
    }
    return initialPlayerState;
  });

  // Auto-save on state changes (debounced)
  useEffect(() => {
    if (state.gamePhase === GAME_PHASES.LANDING) return;
    if (!state.name) return;

    const timer = setTimeout(() => {
      SaveManager.save({
        ...state,
        lastSaved: new Date().toISOString(),
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [state]);

  // ---- Convenience Actions ----
  const setPlayerIdentity = useCallback((name, displayName, avatar) => {
    dispatch({
      type: ACTION_TYPES.SET_PLAYER_IDENTITY,
      payload: { name, displayName, avatar },
    });
  }, []);

  const setGamePhase = useCallback((phase) => {
    dispatch({ type: ACTION_TYPES.SET_GAME_PHASE, payload: phase });
  }, []);

  const advanceScene = useCallback((sceneId, missionId) => {
    dispatch({
      type: ACTION_TYPES.ADVANCE_SCENE,
      payload: { sceneId, missionId },
    });
  }, []);

  const completeObjective = useCallback((objectiveId) => {
    dispatch({ type: ACTION_TYPES.COMPLETE_OBJECTIVE, payload: objectiveId });
  }, []);

  const completeScene = useCallback((sceneId) => {
    dispatch({ type: ACTION_TYPES.COMPLETE_SCENE, payload: sceneId });
  }, []);

  const completeMission = useCallback((missionId, nextMission, nextScene) => {
    dispatch({
      type: ACTION_TYPES.COMPLETE_MISSION,
      payload: { missionId, nextMission, nextScene },
    });
  }, []);

  const setStoryFlag = useCallback((flag) => {
    dispatch({ type: ACTION_TYPES.SET_STORY_FLAG, payload: flag });
  }, []);

  const setStoryFlags = useCallback((flags) => {
    dispatch({ type: ACTION_TYPES.SET_STORY_FLAGS, payload: flags });
  }, []);

  const addXp = useCallback((amount) => {
    dispatch({ type: ACTION_TYPES.ADD_XP, payload: amount });
  }, []);

  const unlockConcept = useCallback((concept) => {
    dispatch({ type: ACTION_TYPES.UNLOCK_CONCEPT, payload: concept });
  }, []);

  const addMessage = useCallback((message) => {
    dispatch({ type: ACTION_TYPES.ADD_MESSAGE, payload: message });
  }, []);

  const markMessagesRead = useCallback(() => {
    dispatch({ type: ACTION_TYPES.MARK_MESSAGES_READ });
  }, []);

  const addTerminalEntry = useCallback((entry) => {
    dispatch({ type: ACTION_TYPES.ADD_TERMINAL_ENTRY, payload: entry });
  }, []);

  const clearTerminal = useCallback(() => {
    dispatch({ type: ACTION_TYPES.CLEAR_TERMINAL });
  }, []);

  const makeDecision = useCallback((decision) => {
    dispatch({ type: ACTION_TYPES.MAKE_DECISION, payload: decision });
  }, []);

  const incrementDay = useCallback(() => {
    dispatch({ type: ACTION_TYPES.INCREMENT_DAY });
  }, []);

  const hasSave = useCallback(() => SaveManager.hasSave(), []);

  const deleteSave = useCallback(() => {
    SaveManager.deleteSave();
    dispatch({ type: ACTION_TYPES.LOAD_STATE, payload: initialPlayerState });
  }, []);

  const value = {
    state,
    dispatch,
    // Convenience actions
    setPlayerIdentity,
    setGamePhase,
    advanceScene,
    completeObjective,
    completeScene,
    completeMission,
    setStoryFlag,
    setStoryFlags,
    addXp,
    unlockConcept,
    addMessage,
    markMessagesRead,
    addTerminalEntry,
    clearTerminal,
    makeDecision,
    incrementDay,
    hasSave,
    deleteSave,
    // Constants
    GAME_PHASES,
    GAME_CONFIG,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export default GameContext;
