/* ============================================
   LOST IN THE CLOUD — Game Workspace
   Contextual gameplay container without permanent dashboard clutter.
   ============================================ */

import React, { useState } from 'react';
import { useGame } from '../state/GameContext';
import { GAME_PHASES } from '../state/playerReducer';
import Navigation from '../components/common/Navigation';
import CenterPanel from '../components/workspace/CenterPanel';
import ClubHome from '../components/club/ClubHome';
import PlayerProfile from '../components/profile/PlayerProfile';
import { getCharacter } from '../data/characters';
import './GameWorkspace.css';

export default function GameWorkspace() {
  const { state, setGamePhase, markMessagesRead } = useGame();
  const [activeMode, setActiveMode] = useState('story'); // 'story' | 'club'
  const [showComms, setShowComms] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleOpenHome = () => {
    setGamePhase(GAME_PHASES.LANDING);
  };

  const handleToggleClub = () => {
    setActiveMode(prev => prev === 'club' ? 'story' : 'club');
  };

  const handleOpenComms = () => {
    setShowComms(true);
    markMessagesRead();
  };

  return (
    <div className="game-workspace-root">
      {/* Minimal Top HUD */}
      <Navigation
        onOpenHome={handleOpenHome}
        onOpenClub={handleToggleClub}
        onOpenComms={handleOpenComms}
        onOpenProfile={() => setShowProfile(true)}
        isClubActive={activeMode === 'club'}
      />

      {/* Main Viewport Stage */}
      <main className="game-viewport">
        {activeMode === 'story' ? (
          <CenterPanel />
        ) : (
          <div className="decoupled-club-container anim-fade-in">
            <div className="decoupled-club-header">
              <button className="decoupled-club-back-btn" onClick={() => setActiveMode('story')}>
                ← RETURN TO CAREER
              </button>
            </div>
            <ClubHome />
          </div>
        )}
      </main>

      {/* Narrative Pager / Communications Modal */}
      {showComms && (
        <div className="comms-drawer-backdrop" onClick={() => setShowComms(false)}>
          <div className="comms-drawer anim-slide-in" onClick={e => e.stopPropagation()}>
            <div className="comms-drawer__header">
              <div className="comms-drawer__title">
                <span className="comms-drawer__icon">✉</span>
                <span>NEXORA SECURE COMMS // PAGER</span>
              </div>
              <button className="comms-drawer__close" onClick={() => setShowComms(false)}>✕</button>
            </div>

            <div className="comms-drawer__body">
              {state.messages && state.messages.length > 0 ? (
                state.messages.slice().reverse().map(msg => {
                  const sender = getCharacter(msg.sender || 'maya');
                  return (
                    <div key={msg.id} className="comms-message-item">
                      <div className="comms-message-header">
                        <span className="comms-message-sender" style={{ color: sender.accentColor }}>
                          {sender.name.toUpperCase()}
                        </span>
                        <span className="comms-message-time">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="comms-message-text">"{msg.text || msg.content}"</p>
                    </div>
                  );
                })
              ) : (
                <div className="comms-empty-state">
                  <span className="comms-empty-icon">◈</span>
                  <p>No new urgent transmissions on the network.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Player Career Profile Modal */}
      {showProfile && (
        <div className="profile-modal-backdrop" onClick={() => setShowProfile(false)}>
          <div className="profile-modal anim-fade-in" onClick={e => e.stopPropagation()}>
            <div className="profile-modal__header">
              <h3>ENGINEER PERSONNEL DOSSIER</h3>
              <button className="profile-modal__close" onClick={() => setShowProfile(false)}>✕</button>
            </div>
            <div className="profile-modal__body">
              <PlayerProfile />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
