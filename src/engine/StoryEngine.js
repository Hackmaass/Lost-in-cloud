/* ============================================
   LOST IN THE CLOUD — Story Engine
   ============================================
   Data-driven narrative engine.
   Resolves current scene, evaluates conditions,
   manages dialogue progression.
   ============================================ */

import ACT_1 from '../data/story/act1';

// All acts registry — add future acts here
const ACTS = {
  act1: ACT_1,
};

class StoryEngineCore {
  getAct(actId) {
    return ACTS[actId] || null;
  }

  getMission(actId, missionId) {
    const act = this.getAct(actId);
    if (!act) return null;
    return act.missions.find(m => m.id === missionId) || null;
  }

  getScene(actId, missionId, sceneId) {
    const mission = this.getMission(actId, missionId);
    if (!mission) return null;
    return mission.scenes.find(s => s.id === sceneId) || null;
  }

  getCurrentScene(state) {
    return this.getScene(state.currentAct, state.currentMission, state.currentScene);
  }

  getCurrentMission(state) {
    return this.getMission(state.currentAct, state.currentMission);
  }

  getCurrentAct(state) {
    return this.getAct(state.currentAct);
  }

  getAllMissions(actId) {
    const act = this.getAct(actId);
    if (!act) return [];
    return act.missions;
  }

  getNextScene(state) {
    const mission = this.getCurrentMission(state);
    if (!mission) return null;

    const currentIndex = mission.scenes.findIndex(s => s.id === state.currentScene);
    if (currentIndex === -1 || currentIndex >= mission.scenes.length - 1) return null;

    return mission.scenes[currentIndex + 1];
  }

  getNextSceneId(state) {
    const next = this.getNextScene(state);
    return next ? next.id : null;
  }

  getMissionProgress(state) {
    const mission = this.getCurrentMission(state);
    if (!mission || !mission.objectives.length) return 0;

    const completed = mission.objectives.filter(
      obj => state.completedObjectives.includes(obj.id)
    ).length;

    return Math.round((completed / mission.objectives.length) * 100);
  }

  getMissionObjectives(state) {
    const mission = this.getCurrentMission(state);
    if (!mission) return [];

    return mission.objectives.map(obj => ({
      ...obj,
      completed: state.completedObjectives.includes(obj.id),
    }));
  }

  isMissionComplete(state, missionId) {
    return state.completedMissions.includes(missionId);
  }

  isMissionAvailable(state, missionId) {
    const act = this.getCurrentAct(state);
    if (!act) return false;

    const mission = act.missions.find(m => m.id === missionId);
    if (!mission) return false;

    if (mission.status === 'available') return true;
    if (this.isMissionComplete(state, missionId)) return true;

    // Check if previous mission is complete
    const missionIndex = act.missions.findIndex(m => m.id === missionId);
    if (missionIndex <= 0) return true;

    const prevMission = act.missions[missionIndex - 1];
    return this.isMissionComplete(state, prevMission.id);
  }

  evaluateCondition(condition, state) {
    if (!condition) return true;

    if (condition.requiredFlag) {
      return state.storyFlags.includes(condition.requiredFlag);
    }
    if (condition.requiredMission) {
      return state.completedMissions.includes(condition.requiredMission);
    }
    if (condition.requiredXp) {
      return state.xp >= condition.requiredXp;
    }

    return true;
  }
}

const StoryEngine = new StoryEngineCore();

export default StoryEngine;
