/* ============================================
   LOST IN THE CLOUD — Recommendation Engine
   ============================================
   Deterministic recommendation system answering:
   1. What am I doing now?
   2. What should I do next?
   3. What's happening in the AWS Cloud Club?
   ============================================ */

import StoryEngine from './StoryEngine';
import { CLUB_DATA } from '../data/club/clubData';
import { SKILL_DOMAINS } from '../data/progression/skills';

export class RecommendationEngine {
  static getRecommendations(playerState) {
    const currentMission = StoryEngine.getCurrentMission(playerState);
    const missionProgress = StoryEngine.getMissionProgress(playerState);
    const completedCount = (playerState.completedMissions || []).length;
    const unlockedConcepts = playerState.unlockedConcepts || [];

    // 1. What am I doing now?
    const currentActivity = {
      title: currentMission ? `Mission ${currentMission.number} — ${currentMission.title}` : 'Act I Operations Complete',
      description: currentMission ? currentMission.description : 'All assigned Nexora engineering incidents resolved.',
      progress: missionProgress,
      day: playerState.day || 1,
      badge: currentMission ? `DAY ${playerState.day}` : 'ACTIVE',
    };

    // 2. What should I do next?
    let nextStep = {
      title: 'Continue Active Mission',
      description: 'Check the center workspace or terminal to diagnose the current incident.',
      category: 'Game',
      actionView: 'mission',
      actionLabel: 'OPEN WORKSPACE ▸',
    };

    if (completedCount >= 2 && !unlockedConcepts.includes('S3')) {
      nextStep = {
        title: 'Master S3 Object Storage',
        description: 'Learn how to offload local EBS volume pressure to highly scalable S3 buckets.',
        category: 'Learning',
        actionView: 'skills',
        actionLabel: 'VIEW SKILLS ▸',
      };
    } else if (completedCount >= 6 && !(playerState.clubProjects || []).length) {
      nextStep = {
        title: 'Take the 10x Traffic Surge Challenge',
        description: 'You just stabilized Nexora under heavy traffic. Submit your own architecture on the Club portal.',
        category: 'Club Challenge',
        actionView: 'club',
        actionLabel: 'VIEW CHALLENGE ▸',
      };
    } else if (completedCount >= 10) {
      nextStep = {
        title: 'Publish Your First Project',
        description: 'Showcase your serverless or cloud architecture to the entire AWS Cloud Club community.',
        category: 'Project',
        actionView: 'projects',
        actionLabel: 'PUBLISH PROJECT ▸',
      };
    }

    // 3. What's happening in the club?
    const nextEvent = CLUB_DATA.events[0];
    const clubHighlight = {
      eventTitle: nextEvent ? nextEvent.title : 'Serverless Night Workshop',
      eventDate: nextEvent ? nextEvent.date : 'Tomorrow · 6:00 PM',
      eventType: nextEvent ? nextEvent.type : 'Workshop',
      activeSeason: CLUB_DATA.activeSeason.title,
      daysRemaining: CLUB_DATA.activeSeason.daysRemaining,
    };

    return {
      currentActivity,
      nextStep,
      clubHighlight,
    };
  }
}

export default RecommendationEngine;
