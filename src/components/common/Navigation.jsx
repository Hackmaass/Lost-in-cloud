/* ============================================
   LOST IN THE CLOUD — Minimal Gameplay HUD
   Unobtrusive contextual top bar.
   ============================================ */

import React from 'react';
import { useGame } from '../../state/GameContext';
import StoryEngine from '../../engine/StoryEngine';
import GAME_CONFIG from '../../data/config';
import './Navigation.css';

export default function Navigation({ onOpenHome, onOpenClub, onOpenComms, onOpenProfile, isClubActive = false }) {
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

      {/* Contextual Actions (Comms, Cloud Club, Profile) */}
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

        {/* Decoupled AWS Cloud Club Toggle */}
        <button
          className={`game-hud__action-btn ${isClubActive ? 'game-hud__action-btn--active' : ''}`}
          onClick={onOpenClub}
          title="AWS Cloud Club Community"
        >
          <span className="game-hud__btn-icon">☁</span>
          <span className="game-hud__btn-text">CLOUD CLUB</span>
        </button>

        {/* Engineer Profile Chip */}
        <button className="game-hud__player-chip" onClick={onOpenProfile} title="Engineer Career Record">
          <div className="game-hud__avatar-dot" />
          <span className="game-hud__player-name">{state.displayName || state.name || 'Engineer'}</span>
        </button>
      </div>
    </header>
  );
}
