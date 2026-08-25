/* ============================================
   LOST IN THE CLOUD — Player Creation
   ============================================ */

import React, { useState } from 'react';
import { useGame } from '../state/GameContext';
import { GAME_PHASES } from '../state/playerReducer';
import GAME_CONFIG from '../data/config';
import './PlayerCreation.css';

const AVATARS = ['👤', '🧑‍💻', '👩‍💻', '🧑‍🔧', '👨‍💻', '🦊'];

export default function PlayerCreation() {
  const { setPlayerIdentity, setGamePhase } = useGame();
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState(0);
  const [phase, setPhase] = useState('form'); // 'form' | 'record'
  const [recordVisible, setRecordVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const dName = displayName.trim() || name.trim();
    setPlayerIdentity(name.trim(), dName, avatar);
    setPhase('record');

    // Animate record card in
    setTimeout(() => setRecordVisible(true), 100);
  };

  const handleReport = () => {
    setGamePhase(GAME_PHASES.CINEMATIC_INTRO);
  };

  return (
    <div className="player-creation">
      <div className="player-creation__bg-pattern" />

      {phase === 'form' ? (
        <div className="player-creation__card anim-fade-in-up">
          {/* Header */}
          <div className="player-creation__header">
            <div className="player-creation__company">NEXORA SYSTEMS</div>
            <div className="player-creation__dept">EMPLOYEE ONBOARDING</div>
          </div>

          <div className="player-creation__divider" />

          <form onSubmit={handleSubmit} className="player-creation__form">
            <div className="player-creation__field">
              <label className="player-creation__label">FULL NAME</label>
              <input
                className="player-creation__input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                autoFocus
                maxLength={40}
              />
            </div>

            <div className="player-creation__field">
              <label className="player-creation__label">DISPLAY NAME <span className="player-creation__optional">(OPTIONAL)</span></label>
              <input
                className="player-creation__input"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={name || 'How the team sees you'}
                maxLength={20}
              />
            </div>

            <div className="player-creation__field">
              <label className="player-creation__label">AVATAR</label>
              <div className="player-creation__avatars">
                {AVATARS.map((a, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`player-creation__avatar ${avatar === i ? 'player-creation__avatar--selected' : ''}`}
                    onClick={() => setAvatar(i)}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="player-creation__submit"
              disabled={!name.trim()}
            >
              CREATE EMPLOYEE RECORD
            </button>
          </form>
        </div>
      ) : (
        <div className={`player-creation__record ${recordVisible ? 'player-creation__record--visible' : ''}`}>
          {/* Employee Record Card */}
          <div className="player-creation__record-card">
            <div className="player-creation__record-stripe" />

            <div className="player-creation__record-header">
              <div className="player-creation__record-company">{GAME_CONFIG.company.name}</div>
              <div className="player-creation__record-dept">{GAME_CONFIG.playerDefaults.department.toUpperCase()}</div>
            </div>

            <div className="player-creation__record-divider" />

            <div className="player-creation__record-avatar">
              {AVATARS[avatar]}
            </div>

            <div className="player-creation__record-fields">
              <div className="player-creation__record-row">
                <span className="player-creation__record-label">EMPLOYEE</span>
                <span className="player-creation__record-value">{name.toUpperCase()}</span>
              </div>
              <div className="player-creation__record-row">
                <span className="player-creation__record-label">POSITION</span>
                <span className="player-creation__record-value">{GAME_CONFIG.playerDefaults.position.toUpperCase()}</span>
              </div>
              <div className="player-creation__record-row">
                <span className="player-creation__record-label">STATUS</span>
                <span className="player-creation__record-value player-creation__record-value--active">
                  ● {GAME_CONFIG.playerDefaults.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="player-creation__record-id">
              ID: NXR-{String(Math.floor(Math.random() * 9000 + 1000))}
            </div>
          </div>

          <button className="player-creation__report-btn" onClick={handleReport}>
            REPORT TO DUTY
          </button>
        </div>
      )}
    </div>
  );
}
