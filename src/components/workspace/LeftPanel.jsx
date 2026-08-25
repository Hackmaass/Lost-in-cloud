/* ============================================
   LOST IN THE CLOUD — Left Panel
   Mission briefing, objectives, progress
   ============================================ */

import React from 'react';
import { useGame } from '../../state/GameContext';
import StoryEngine from '../../engine/StoryEngine';
import GAME_CONFIG from '../../data/config';
import './LeftPanel.css';

export default function LeftPanel() {
  const { state } = useGame();

  const currentMission = StoryEngine.getCurrentMission(state);
  const objectives = StoryEngine.getMissionObjectives(state);
  const progress = StoryEngine.getMissionProgress(state);
  const allMissions = StoryEngine.getAllMissions(state.currentAct);
  const act = StoryEngine.getCurrentAct(state);

  return (
    <div className="lpanel">
      {/* Nexora Identity */}
      <div className="lpanel__header">
        <div className="lpanel__company">◈ {GAME_CONFIG.company.name}</div>
        <div className="lpanel__day">DAY {state.day}</div>
      </div>

      <div className="lpanel__divider" />

      {/* Player Role */}
      <div className="lpanel__role">
        <div className="lpanel__role-label">YOUR POSITION</div>
        <div className="lpanel__role-value">{state.position}</div>
        <div className="lpanel__role-dept">{state.department}</div>
      </div>

      <div className="lpanel__divider" />

      {/* Current Mission */}
      {currentMission && (
        <div className="lpanel__mission">
          <div className="lpanel__section-label">CURRENT MISSION</div>
          <div className="lpanel__mission-number">MISSION {currentMission.number}</div>
          <div className="lpanel__mission-title">{currentMission.title}</div>
          <div className="lpanel__mission-desc">{currentMission.description}</div>

          {/* Progress Bar */}
          <div className="lpanel__progress">
            <div className="lpanel__progress-bar">
              <div
                className="lpanel__progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="lpanel__progress-text">{progress}%</div>
          </div>

          {/* Objectives */}
          {objectives.length > 0 && (
            <div className="lpanel__objectives">
              <div className="lpanel__section-label">OBJECTIVES</div>
              {objectives.map(obj => (
                <div
                  key={obj.id}
                  className={`lpanel__objective ${obj.completed ? 'lpanel__objective--done' : ''}`}
                >
                  <span className="lpanel__objective-check">
                    {obj.completed ? '✓' : '○'}
                  </span>
                  <span className="lpanel__objective-text">{obj.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="lpanel__divider" />

      {/* Mission List */}
      <div className="lpanel__missions-list">
        <div className="lpanel__section-label">
          {act ? `ACT I — ${act.title}` : 'MISSIONS'}
        </div>
        {allMissions.map(mission => {
          const isActive = mission.id === state.currentMission;
          const isCompleted = state.completedMissions.includes(mission.id);
          const isAvailable = StoryEngine.isMissionAvailable(state, mission.id);

          return (
            <div
              key={mission.id}
              className={`lpanel__mission-item ${isActive ? 'lpanel__mission-item--active' : ''} ${isCompleted ? 'lpanel__mission-item--completed' : ''} ${!isAvailable ? 'lpanel__mission-item--locked' : ''}`}
            >
              <span className="lpanel__mission-item-num">{mission.number}</span>
              <span className="lpanel__mission-item-title">{mission.title}</span>
              {isCompleted && <span className="lpanel__mission-item-check">✓</span>}
              {!isAvailable && <span className="lpanel__mission-item-lock">🔒</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
