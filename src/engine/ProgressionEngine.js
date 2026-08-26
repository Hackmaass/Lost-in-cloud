/* ============================================
   LOST IN THE CLOUD — Player Progression Engine
   ============================================ */

import { RANKS, calculateRank } from '../data/progression/ranks';
import { SKILL_DOMAINS, getPlayerSkills } from '../data/progression/skills';
import { ACHIEVEMENTS, evaluateAchievements } from '../data/progression/achievements';

export class ProgressionEngine {
  static getRank(playerState) {
    return calculateRank(playerState);
  }

  static getSkills(playerState) {
    return getPlayerSkills(
      playerState.unlockedConcepts || [],
      playerState.completedMissions || []
    );
  }

  static getPerformanceScorecard(playerState) {
    const ratings = Object.values(playerState.missionRatings || {});
    const flags = playerState.storyFlags || [];

    let reliability = 75;
    let security = 70;
    let cost = 70;
    let efficiency = 75;
    let problemSolving = 70;

    // Evaluate from mission ratings
    ratings.forEach(r => {
      if (r.reliability === 'A' || r.reliability === 'A+') reliability += 5;
      if (r.security === 'A' || r.security === 'A+') security += 5;
      if (r.cost === 'A' || r.cost === 'A+') cost += 6;
      if (r.efficiency === 'A' || r.efficiency === 'A+') efficiency += 5;
      if (r.investigation === 'A' || r.investigation === 'A+') problemSolving += 6;
    });

    // Evaluate from story decisions
    if (flags.includes('chose_s3_solution')) { reliability += 5; cost += 5; }
    if (flags.includes('reported_to_maya')) { security += 6; }
    if (flags.includes('chose_scale_out')) { reliability += 8; efficiency += 6; }
    if (flags.includes('chose_scale_up')) { cost -= 8; }
    if (flags.includes('revoked_credentials')) { security += 8; }
    if (flags.includes('connected_all_evidence')) { problemSolving += 10; }

    return {
      reliability: Math.min(99, Math.max(40, reliability)),
      security: Math.min(99, Math.max(40, security)),
      cost: Math.min(99, Math.max(40, cost)),
      efficiency: Math.min(99, Math.max(40, efficiency)),
      problemSolving: Math.min(99, Math.max(40, problemSolving)),
    };
  }

  static checkAchievements(playerState) {
    return evaluateAchievements(playerState);
  }
}

export default ProgressionEngine;
