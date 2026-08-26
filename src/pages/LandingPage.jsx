/* ============================================
   LOST IN THE CLOUD — Game Home
   Minimalist narrative game home screen.
   Benchmark: Lost at SQL UX philosophy.
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

  const handleOpenClub = () => {
    AudioManager.play('ui_click');
    if (!state.name) {
      // Create default profile if not set
      dispatch({
        type: 'SET_PLAYER_IDENTITY',
        payload: { name: 'Omkar Rane', displayName: 'Omkar' },
      });
    }
    setGamePhase(GAME_PHASES.GAMEPLAY);
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
        clubXp: 450,
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

      {/* Main Home Hub */}
      <div className="game-home__container anim-fade-in">
        {/* Title */}
        <div className="game-home__brand">
          <div className="game-home__icon">◈</div>
          <h1 className="game-home__title">LOST IN THE CLOUD</h1>
          <p className="game-home__tagline">A Narrative Cloud Engineering Investigation</p>
        </div>

        {/* Primary Action Card: CONTINUE CAREER */}
        <div className="game-home__career-card">
          <div className="game-home__career-header">
            <span className="game-home__badge">ACTIVE MISSION</span>
            <span className="game-home__day-badge">DAY 0{state.day || currentMission.day || 1}</span>
          </div>

          <div className="game-home__mission-info">
            <div className="game-home__act-title">ACT I: THE FIRST WEEK</div>
            <h2 className="game-home__mission-title">
              MISSION 0{currentMission.number || '01'} — {currentMission.title}
            </h2>
            <p className="game-home__mission-desc">{currentMission.description}</p>
          </div>

          <button className="game-home__primary-btn" onClick={handleContinueCareer}>
            <span className="game-home__btn-text">
              {state.name ? 'CONTINUE CAREER' : 'BEGIN CAREER'}
            </span>
            <span className="game-home__btn-arrow">→</span>
          </button>
        </div>

        {/* Career & Club Sub-cards */}
        <div className="game-home__sub-grid">
          {/* Career Identity */}
          <div className="game-home__sub-card">
            <div className="game-home__sub-card-label">CURRENT ROLE</div>
            <div className="game-home__sub-card-val">Junior Cloud Engineer</div>
            <div className="game-home__sub-card-sub">Nexora Systems // Infrastructure</div>
          </div>

          {/* Decoupled Cloud Club */}
          <div className="game-home__sub-card game-home__sub-card--club" onClick={handleOpenClub}>
            <div className="game-home__sub-card-label">AWS CLOUD CLUB</div>
            <div className="game-home__sub-card-val">3 Active Challenges</div>
            <div className="game-home__sub-card-sub">Events • Projects • Leaderboard →</div>
          </div>
        </div>

        {/* Demo Mission Fast-Launcher */}
        <div className="game-home__footer">
          <button className="game-home__demo-btn" onClick={() => setShowDemoModal(true)}>
            <span>⚡ Jump to Any Mission (Demo Launcher)</span>
          </button>
        </div>
      </div>

      {/* Demo Mission Selection Modal */}
      {showDemoModal && (
        <div className="game-home-modal-backdrop" onClick={() => setShowDemoModal(false)}>
          <div className="game-home-modal anim-fade-in" onClick={e => e.stopPropagation()}>
            <div className="game-home-modal__header">
              <h3>SELECT DEMO MISSION (ACT I)</h3>
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
                  <div className="demo-mission-item__action">LAUNCH →</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
