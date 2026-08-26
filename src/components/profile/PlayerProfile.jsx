/* ============================================
   LOST IN THE CLOUD — Player Engineering Profile
   ============================================ */

import React, { useState } from 'react';
import { useGame } from '../../state/GameContext';
import ProgressionEngine from '../../engine/ProgressionEngine';
import RecommendationEngine from '../../engine/RecommendationEngine';
import './PlayerProfile.css';

export default function PlayerProfile() {
  const { state } = useGame();
  const [showPublicModal, setShowPublicModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const rankInfo = ProgressionEngine.getRank(state);
  const performance = ProgressionEngine.getPerformanceScorecard(state);
  const skills = ProgressionEngine.getSkills(state);
  const recs = RecommendationEngine.getRecommendations(state);

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="profile-page">
      {/* Profile Header & Identity Card */}
      <div className="profile-hero">
        <div className="profile-hero__avatar">
          <div className="profile-hero__avatar-circle" style={{ borderColor: rankInfo.current.color }}>
            {state.avatar ? <span>{state.avatar}</span> : <span>{state.name ? state.name.charAt(0).toUpperCase() : 'E'}</span>}
          </div>
          <span className="profile-hero__rank-badge" style={{ background: rankInfo.current.color }}>
            {rankInfo.current.badge} {rankInfo.current.title}
          </span>
        </div>

        <div className="profile-hero__info">
          <div className="profile-hero__name-row">
            <h1 className="profile-hero__name">{state.name || 'Cloud Engineer'}</h1>
            <span className="profile-hero__tag">NEXORA INFRASTRUCTURE ID: #NX-8829</span>
          </div>

          <div className="profile-hero__meta">
            <span><strong>Role:</strong> {state.position}</span>
            <span>•</span>
            <span><strong>Department:</strong> {state.department}</span>
            <span>•</span>
            <span><strong>Tenure:</strong> Day {state.day}</span>
            <span>•</span>
            <span className="profile-hero__status">● {state.status.toUpperCase()}</span>
          </div>

          {/* Rank Progress Bar */}
          <div className="profile-hero__rank-progress">
            <div className="profile-hero__rank-labels">
              <span>CURRENT RANK: <strong>{rankInfo.current.title}</strong></span>
              <span>{rankInfo.next ? `NEXT: ${rankInfo.next.title} (${rankInfo.progressPercent}%)` : 'MAXIMUM RANK ACHIEVED'}</span>
            </div>
            <div className="profile-hero__bar">
              <div
                className="profile-hero__bar-fill"
                style={{ width: `${rankInfo.progressPercent}%`, background: rankInfo.current.color }}
              />
            </div>
          </div>
        </div>

        <div className="profile-hero__actions">
          <button className="profile-share-btn" onClick={() => setShowPublicModal(true)}>
            🔗 PUBLIC PORTFOLIO
          </button>
        </div>
      </div>

      <div className="profile-grid">
        {/* Card 1: Dual XP & Progression Metrics */}
        <div className="profile-card">
          <div className="profile-card__header">
            <span className="profile-card__title">CAREER XP & PARTICIPATION</span>
            <span className="profile-card__sub">Dual Track Engine</span>
          </div>

          <div className="profile-dual-xp">
            <div className="profile-xp-box">
              <span className="profile-xp-box__label">NEXORA ENGINEERING XP</span>
              <span className="profile-xp-box__val">{state.xp} XP</span>
              <span className="profile-xp-box__sub">Level {state.level} • {state.completedMissions.length}/10 Incidents</span>
            </div>

            <div className="profile-xp-box profile-xp-box--club">
              <span className="profile-xp-box__label">AWS CLOUD CLUB XP</span>
              <span className="profile-xp-box__val">{state.clubXp || 450} XP</span>
              <span className="profile-xp-box__sub">{(state.registeredEvents || []).length} Events • {(state.clubProjects || []).length} Projects</span>
            </div>
          </div>

          {/* Contextual Recommendation Callout */}
          <div className="profile-rec-banner">
            <div className="profile-rec-banner__tag">💡 NEXT RECOMMENDED ACTION:</div>
            <div className="profile-rec-banner__title">{recs.nextStep.title}</div>
            <div className="profile-rec-banner__desc">{recs.nextStep.description}</div>
          </div>
        </div>

        {/* Card 2: 5-Axis Engineering Performance Scorecard */}
        <div className="profile-card">
          <div className="profile-card__header">
            <span className="profile-card__title">5-AXIS ENGINEERING SCORECARD</span>
            <span className="profile-card__sub">Evaluated from Live Incidents</span>
          </div>

          <div className="profile-scorecard">
            {Object.entries(performance).map(([metric, score]) => (
              <div key={metric} className="profile-scorecard-row">
                <div className="profile-scorecard-header">
                  <span className="profile-scorecard-label">{metric.toUpperCase()}</span>
                  <span className="profile-scorecard-val">{score}/100</span>
                </div>
                <div className="profile-scorecard-bar">
                  <div
                    className="profile-scorecard-bar__fill"
                    style={{
                      width: `${score}%`,
                      background: score >= 80 ? 'var(--color-success)' : score >= 65 ? 'var(--color-primary)' : 'var(--color-warning)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Unlocked Cloud Concepts Showcase */}
        <div className="profile-card profile-card--full">
          <div className="profile-card__header">
            <span className="profile-card__title">AWS CONCEPTS MASTERED ({state.unlockedConcepts.length})</span>
            <span className="profile-card__sub">Interactive Knowledge Inventory</span>
          </div>

          {state.unlockedConcepts.length === 0 ? (
            <div className="text-dim">No AWS concepts unlocked yet. Complete missions in Act I to master cloud services.</div>
          ) : (
            <div className="profile-concepts-grid">
              {state.unlockedConcepts.map((concept) => (
                <div key={concept} className="profile-concept-pill">
                  <span className="profile-concept-pill__icon">◆</span>
                  <span>{concept}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Shareable Public Portfolio Modal */}
      {showPublicModal && (
        <div className="profile-modal-overlay" onClick={() => setShowPublicModal(false)}>
          <div className="profile-modal anim-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal__header">
              <div>
                <span className="profile-modal__tag">AWS CLOUD CLUB • PUBLIC PORTFOLIO</span>
                <h2 className="profile-modal__title">{state.name} — Verified Cloud Engineer</h2>
              </div>
              <button className="profile-modal__close" onClick={() => setShowPublicModal(false)}>✕</button>
            </div>

            <div className="profile-modal__body">
              <div className="public-card">
                <div className="public-card__rank">
                  <span className="public-card__rank-badge" style={{ background: rankInfo.current.color }}>
                    {rankInfo.current.badge} {rankInfo.current.title}
                  </span>
                  <span className="public-card__xp">{state.xp + (state.clubXp || 450)} Total Cloud XP</span>
                </div>

                <div className="public-card__stats">
                  <div><strong>Missions Resolved:</strong> {state.completedMissions.length}/10</div>
                  <div><strong>Concepts Mastered:</strong> {state.unlockedConcepts.length}</div>
                  <div><strong>Reliability Score:</strong> {performance.reliability}%</div>
                  <div><strong>Security Score:</strong> {performance.security}%</div>
                </div>

                <div className="public-card__skills">
                  <div className="public-card__skills-title">TOP SKILL DOMAINS:</div>
                  <div className="public-card__skills-chips">
                    {skills.slice(0, 5).map(s => (
                      <span key={s.id} className="public-chip">{s.name} (Tier {s.level})</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="profile-modal__copy-row">
                <input
                  type="text"
                  className="profile-modal__link-input"
                  readOnly
                  value={`https://awscloudclub.college.edu/portfolio/${state.name ? state.name.toLowerCase().replace(/\s+/g, '-') : 'engineer'}`}
                />
                <button className="profile-modal__copy-btn" onClick={handleCopyLink}>
                  {copied ? 'COPIED! ✓' : 'COPY LINK'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
