/* ============================================
   LOST IN THE CLOUD — Game Home
   Minimalist narrative game gateway.
   Inspired by Lost at SQL UX philosophy.
   ============================================ */

import React, { useState } from 'react';
import { useGame } from '../state/GameContext';
import { GAME_PHASES } from '../state/playerReducer';
import StoryEngine from '../engine/StoryEngine';
import AudioManager from '../engine/AudioManager';
import { ACT1_MISSIONS } from '../data/story/act1';
import './LandingPage.css';

export default function LandingPage() {
  const { state, setGamePhase, dispatch } = useGame();
  const [showDemoModal, setShowDemoModal] = useState(false);

  const currentMission = StoryEngine.getCurrentMission(state) || ACT1_MISSIONS[0];

  const handleContinueCareer = () => {
    AudioManager.play('ui_click');
    if (!state.name) {
      setGamePhase(GAME_PHASES.PLAYER_CREATION);
    } else {
      setGamePhase(GAME_PHASES.GAMEPLAY);
    }
  };

  const handleLaunchDemoMission = (mission) => {
    AudioManager.play('ui_click');
    AudioManager.play('terminal_success');

    const mIdx = ACT1_MISSIONS.findIndex(m => m.id === mission.id);
    const completed = ACT1_MISSIONS.slice(0, mIdx).map(m => m.id);

    dispatch({
      type: 'LOAD_STATE',
      payload: {
        ...state,
        name: state.name || 'Omkar Rane',
        displayName: state.displayName || 'Omkar',
        department: 'Infrastructure Engineering',
        position: 'Junior Cloud Engineer',
        status: 'Active',
        gamePhase: GAME_PHASES.GAMEPLAY,
        currentAct: 'act1',
        currentMission: mission.id,
        currentScene: mission.scenes[0].id,
        currentObjectiveIndex: 0,
        day: mission.day || 1,
        completedMissions: completed,
        completedObjectives: [],
        completedScenes: [],
        storyFlags: ['orientation_done', 'met_team'],
        xp: mIdx * 200 + 100,
      },
    });

    setShowDemoModal(false);
  };

  return (
    <div className="game-home">
      {/* Ambient Backdrop */}
      <div className="game-home__backdrop">
        <div className="game-home__grid-lines" />
        <div className="game-home__glow-orb" />
      </div>

      {/* Main Game Card Container */}
      <div className="game-home__container anim-fade-in">
        {/* Brand */}
        <div className="game-home__brand">
          <div className="game-home__icon">◈</div>
          <h1 className="game-home__title">LOST IN THE CLOUD</h1>
          <p className="game-home__tagline">The Interactive AWS Cloud Engineering Investigation Game</p>
        </div>

        {/* Primary Mission Card */}
        <div className="game-home__career-card">
          <div className="game-home__career-header">
            <span className="game-home__badge">ASSIGNED INCIDENT</span>
            <span className="game-home__day-badge">DAY 0{state.day || currentMission.day || 1}</span>
          </div>

          <div className="game-home__mission-info">
            <div className="game-home__act-title">ACT I: THE FIRST WEEK AT NEXORA</div>
            <h2 className="game-home__mission-title">
              MISSION 0{currentMission.number || '01'} — {currentMission.title}
            </h2>
            <p className="game-home__mission-desc">{currentMission.description}</p>
          </div>

          <button className="game-home__primary-btn" onClick={handleContinueCareer}>
            <span className="game-home__btn-text">
              {state.name ? 'CONTINUE INVESTIGATION' : 'PLAY AS JUNIOR CLOUD ENGINEER'}
            </span>
            <span className="game-home__btn-arrow">→</span>
          </button>
        </div>

        {/* Engineer Clearance & Mission Switcher */}
        <div className="game-home__sub-grid">
          <div className="game-home__sub-card">
            <div className="game-home__sub-card-label">ASSIGNED ROLE</div>
            <div className="game-home__sub-card-val">Junior Cloud Engineer</div>
            <div className="game-home__sub-card-sub">Nexora Systems // Infrastructure Team</div>
          </div>

          <div className="game-home__sub-card game-home__sub-card--clickable" onClick={() => setShowDemoModal(true)}>
            <div className="game-home__sub-card-label">MISSION SELECTOR</div>
            <div className="game-home__sub-card-val">10 Act I Missions</div>
            <div className="game-home__sub-card-sub">Jump to any incident investigation →</div>
          </div>
        </div>
      </div>

      {/* Demo Mission Selection Modal */}
      {showDemoModal && (
        <div className="game-home-modal-backdrop" onClick={() => setShowDemoModal(false)}>
          <div className="game-home-modal anim-fade-in" onClick={e => e.stopPropagation()}>
            <div className="game-home-modal__header">
              <h3>SELECT INVESTIGATION INCIDENT</h3>
              <button className="game-home-modal__close" onClick={() => setShowDemoModal(false)}>✕</button>
            </div>
            <div className="game-home-modal__body">
              {ACT1_MISSIONS.map(m => (
                <div
                  key={m.id}
                  className="demo-mission-item"
                  onClick={() => handleLaunchDemoMission(m)}
                >
                  <div className="demo-mission-item__num">0{m.number}</div>
                  <div className="demo-mission-item__info">
                    <div className="demo-mission-item__title">{m.title}</div>
                    <div className="demo-mission-item__desc">{m.description}</div>
                  </div>
                  <div className="demo-mission-item__action">PLAY →</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
