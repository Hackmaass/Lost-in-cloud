/* ============================================
   LOST IN THE CLOUD — Game Workspace
   Pure narrative cloud engineering investigation stage.
   ============================================ */

import React, { useState } from 'react';
import { useGame } from '../state/GameContext';
import { GAME_PHASES } from '../state/playerReducer';
import Navigation from '../components/common/Navigation';
import CenterPanel from '../components/workspace/CenterPanel';
import PlayerProfile from '../components/profile/PlayerProfile';
import { getCharacter } from '../data/characters';
import './GameWorkspace.css';

export default function GameWorkspace() {
  const { state, setGamePhase, markMessagesRead } = useGame();
  const [showComms, setShowComms] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleOpenHome = () => {
    setGamePhase(GAME_PHASES.LANDING);
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
        onOpenComms={handleOpenComms}
        onOpenProfile={() => setShowProfile(true)}
      />

      {/* Main Narrative & Investigation Viewport Stage */}
      <main className="game-viewport">
        <CenterPanel />
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
                  <p>No new transmissions on the internal network.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Player Career Profile Dossier Modal */}
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
