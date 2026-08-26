/* ============================================
   LOST IN THE CLOUD — Story Engine
   ============================================
   Data-driven narrative engine.
   Resolves current scene, evaluates conditions,
   manages dialogue progression & evidence.
   ============================================ */

import ACT_1 from '../data/story/act1';
import { EVIDENCE, getEvidence } from '../data/evidence';

// All acts registry — add future acts here
const ACTS = {
  act1: ACT_1,
};

class StoryEngineCore {
  getAct(actId) {
    return ACTS[actId] || ACTS.act1;
  }

  getMission(actId, missionId) {
    const act = this.getAct(actId);
    if (!act) return null;
    return act.missions.find(m => m.id === missionId) || act.missions[0] || null;
  }

  getScene(actId, missionId, sceneId) {
    const mission = this.getMission(actId, missionId);
    if (!mission) return null;
    return mission.scenes.find(s => s.id === sceneId) || null;
  }

  getCurrentScene(state) {
    const actId = state.currentAct || 'act1';
    const missionId = state.currentMission || 'mission_01';
    const sceneId = state.currentScene;

    let scene = this.getScene(actId, missionId, sceneId);
    if (!scene) {
      const mission = this.getMission(actId, missionId);
      if (mission && mission.scenes && mission.scenes.length > 0) {
        return mission.scenes[0];
      }
    }
    return scene;
  }

  getCurrentMission(state) {
    return this.getMission(state.currentAct || 'act1', state.currentMission || 'mission_01');
  }

  getCurrentAct(state) {
    return this.getAct(state.currentAct || 'act1');
  }

  getAllMissions(actId) {
    const act = this.getAct(actId || 'act1');
    if (!act) return [];
    return act.missions;
  }

  getNextScene(state) {
    const mission = this.getCurrentMission(state);
    if (!mission) return null;

    const currentSceneObj = this.getCurrentScene(state);
    const currentIndex = mission.scenes.findIndex(s => s.id === (currentSceneObj ? currentSceneObj.id : state.currentScene));
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

  getEvidence(evidenceId) {
    return getEvidence(evidenceId);
  }

  evaluateCondition(condition, state) {
    if (!condition) return true;

    // Story flag check
    if (condition.flag) {
      if (!state.storyFlags.includes(condition.flag)) return false;
    }
    if (condition.notFlag) {
      if (state.storyFlags.includes(condition.notFlag)) return false;
    }

    // Required flag legacy
    if (condition.requiredFlag) {
      if (!state.storyFlags.includes(condition.requiredFlag)) return false;
    }
    if (condition.requiredMission) {
      if (!state.completedMissions.includes(condition.requiredMission)) return false;
    }
    if (condition.requiredXp) {
      if (state.xp < condition.requiredXp) return false;
    }

    return true;
  }

  resolveSceneDialogue(scene, state) {
    if (!scene) return [];

    // Check if there are conditional dialogues
    if (scene.conditionDialogue && Array.isArray(scene.conditionDialogue)) {
      for (const entry of scene.conditionDialogue) {
        if (this.evaluateCondition(entry.condition, state)) {
          return entry.dialogue || [];
        }
      }
    }

    // Fallback to static dialogue
    return scene.dialogue || [];
  }
}

const StoryEngine = new StoryEngineCore();

export default StoryEngine;
