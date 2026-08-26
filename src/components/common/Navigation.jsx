/* ============================================
   LOST IN THE CLOUD — Minimal Gameplay HUD
   Pure investigation game header.
   ============================================ */

import React from 'react';
import { useGame } from '../../state/GameContext';
import StoryEngine from '../../engine/StoryEngine';
import './Navigation.css';

export default function Navigation({ onOpenHome, onOpenComms, onOpenProfile }) {
  const { state } = useGame();
  const currentMission = StoryEngine.getCurrentMission(state);

  return (
    <header className="game-hud">
      {/* Brand & Home Gateway */}
      <div className="game-hud__left">
        <button className="game-hud__brand-btn" onClick={onOpenHome} title="Return to Game Home">
          <span className="game-hud__logo-mark">◈</span>
          <span className="game-hud__brand-title">LOST IN THE CLOUD</span>
        </button>

        <span className="game-hud__divider">/</span>

        <div className="game-hud__time-badge">
          <span className="game-hud__day">DAY 0{state.day || 1}</span>
          <span className="game-hud__clock">08:47 AM</span>
        </div>
      </div>

      {/* Subtle Mission Context */}
      <div className="game-hud__center">
        {currentMission && (
          <div className="game-hud__mission-pill">
            <span className="game-hud__mission-num">MISSION 0{currentMission.number || 1}</span>
            <span className="game-hud__mission-title">{currentMission.title}</span>
          </div>
        )}
      </div>

      {/* Contextual Actions (Pager & Profile) */}
      <div className="game-hud__right">
        {/* Comms / Pager Alert Button */}
        <button
          className={`game-hud__action-btn ${state.unreadMessages > 0 ? 'game-hud__action-btn--alert' : ''}`}
          onClick={onOpenComms}
          title="Communications Pager"
        >
          <span className="game-hud__btn-icon">✉</span>
          <span className="game-hud__btn-text">PAGER</span>
          {state.unreadMessages > 0 && (
            <span className="game-hud__unread-badge">{state.unreadMessages}</span>
          )}
        </button>

        {/* Engineer Personnel Dossier */}
        <button className="game-hud__player-chip" onClick={onOpenProfile} title="Engineer Personnel Dossier">
          <div className="game-hud__avatar-dot" />
          <span className="game-hud__player-name">{state.displayName || state.name || 'Junior Cloud Engineer'}</span>
        </button>
      </div>
    </header>
  );
}
