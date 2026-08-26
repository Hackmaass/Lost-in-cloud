/* ============================================
   LOST IN THE CLOUD — AWS Cloud Club Headquarters
   ============================================ */

import React, { useState } from 'react';
import { useGame } from '../../state/GameContext';
import { CLUB_DATA } from '../../data/club/clubData';
import './ClubHome.css';

export default function ClubHome({ onNavigate }) {
  const { state, registerEvent, unregisterEvent } = useGame();
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);

  const { activeSeason, announcements, events, challenges } = CLUB_DATA;
  const registeredEvents = state.registeredEvents || [];

  const handleToggleRsvp = (eventId) => {
    if (registeredEvents.includes(eventId)) {
      unregisterEvent(eventId);
    } else {
      registerEvent(eventId);
    }
  };

  const handleChallengeSubmit = (e) => {
    e.preventDefault();
    setChallengeSubmitted(true);
    setTimeout(() => {
      setChallengeSubmitted(false);
      setSelectedChallenge(null);
    }, 2500);
  };

  return (
    <div className="club-home">
      {/* Hero: Active Season Banner */}
      <div className="club-season-banner">
        <div className="club-season-banner__content">
          <div className="club-season-banner__tag">
            <span>🏆 ACTIVE CLUB COMPETITION</span>
            <span>•</span>
            <span>{activeSeason.daysRemaining} DAYS REMAINING</span>
          </div>
          <h1 className="club-season-banner__title">
            SEASON {activeSeason.number}: {activeSeason.title}
          </h1>
          <p className="club-season-banner__desc">
            Theme: <strong>{activeSeason.theme}</strong> • Top Prize: {activeSeason.topPrize}
          </p>

          <div className="club-season-stats">
            <div className="club-season-stat">
              <span className="club-season-stat__val">{activeSeason.participantsCount}</span>
              <span className="club-season-stat__lbl">Engineers Competing</span>
            </div>
            <div className="club-season-stat">
              <span className="club-season-stat__val">{activeSeason.projectsCount}</span>
              <span className="club-season-stat__lbl">Projects Published</span>
            </div>
            <div className="club-season-stat">
              <span className="club-season-stat__val">{activeSeason.challengesCount}</span>
              <span className="club-season-stat__lbl">Challenges Active</span>
            </div>
          </div>
        </div>

        <div className="club-season-banner__actions">
          <button className="club-btn club-btn--primary" onClick={() => onNavigate?.('leaderboard')}>
            VIEW LEADERBOARD ▸
          </button>
          <button className="club-btn club-btn--outline" onClick={() => onNavigate?.('projects')}>
            EXPLORE PROJECTS ▸
          </button>
        </div>
      </div>

      {/* Leadership Announcements */}
      <div className="club-announcements-row">
        {announcements.map(ann => (
          <div key={ann.id} className="club-ann-card">
            <div className="club-ann-card__header">
              <span className="club-ann-card__badge">{ann.badge}</span>
              <span className="club-ann-card__date">{ann.date}</span>
            </div>
            <div className="club-ann-card__title">{ann.title}</div>
            <p className="club-ann-card__content">{ann.content}</p>
            <div className="club-ann-card__author">{ann.author}</div>
          </div>
        ))}
      </div>

      <div className="club-home-grid">
        {/* Left Column: Upcoming Events with RSVP */}
        <div className="club-panel">
          <div className="club-panel__header">
            <div>
              <span className="club-panel__tag">WORKSHOPS & SESSIONS</span>
              <h2 className="club-panel__title">UPCOMING CLUB EVENTS</h2>
            </div>
            <button className="club-panel__link" onClick={() => onNavigate?.('events')}>
              VIEW ALL EVENTS ({events.length}) ▸
            </button>
          </div>

          <div className="club-events-list">
            {events.slice(0, 3).map(evt => {
              const isRegistered = registeredEvents.includes(evt.id);
              return (
                <div key={evt.id} className="club-event-item">
                  <div className="club-event-item__header">
                    <span className="club-event-item__type">{evt.type}</span>
                    <span className="club-event-item__date">{evt.date} • {evt.time}</span>
                  </div>

                  <h3 className="club-event-item__title">{evt.title}</h3>
                  <p className="club-event-item__desc">{evt.description}</p>

                  <div className="club-event-item__meta">
                    <span>📍 {evt.location}</span>
                    <span>•</span>
                    <span>🎤 {evt.speaker}</span>
                  </div>

                  <div className="club-event-item__footer">
                    <span className="club-event-item__xp">+{evt.clubXpReward} CLUB XP</span>
                    <button
                      className={`club-rsvp-btn ${isRegistered ? 'club-rsvp-btn--registered' : ''}`}
                      onClick={() => handleToggleRsvp(evt.id)}
                    >
                      {isRegistered ? '✓ REGISTERED' : 'RSVP & ATTEND'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Challenges */}
        <div className="club-panel">
          <div className="club-panel__header">
            <div>
              <span className="club-panel__tag">SKILL COMPETITIONS</span>
              <h2 className="club-panel__title">ACTIVE CLOUD CHALLENGES</h2>
            </div>
          </div>

          <div className="club-challenges-list">
            {challenges.map(chal => (
              <div key={chal.id} className="club-challenge-card" onClick={() => setSelectedChallenge(chal)}>
                <div className="club-challenge-card__header">
                  <span className={`club-diff-badge diff--${chal.difficulty.toLowerCase()}`}>
                    {chal.difficulty}
                  </span>
                  <span className="club-challenge-card__pts">+{chal.points} PTS</span>
                </div>

                <h3 className="club-challenge-card__title">{chal.title}</h3>
                <p className="club-challenge-card__desc">{chal.description}</p>

                <div className="club-challenge-card__footer">
                  <span>{chal.completedBy} submissions</span>
                  <span className="club-challenge-card__action">VIEW BRIEF ▸</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Challenge Detail & Submission Modal */}
      {selectedChallenge && (
        <div className="club-modal-overlay" onClick={() => setSelectedChallenge(null)}>
          <div className="club-modal anim-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="club-modal__header">
              <div>
                <span className="club-modal__tag">{selectedChallenge.category} • {selectedChallenge.difficulty}</span>
                <h2 className="club-modal__title">{selectedChallenge.title}</h2>
              </div>
              <button className="club-modal__close" onClick={() => setSelectedChallenge(null)}>✕</button>
            </div>

            <div className="club-modal__body">
              <p className="club-modal__desc">{selectedChallenge.description}</p>

              <div className="club-modal__section-title">CHALLENGE REQUIREMENTS:</div>
              <ul className="club-modal__reqs-list">
                {selectedChallenge.requirements.map((req, idx) => (
                  <li key={idx}>✓ {req}</li>
                ))}
              </ul>

              {challengeSubmitted ? (
                <div className="club-submit-success anim-pulse">
                  ✓ SUBMISSION RECEIVED! +{selectedChallenge.points} CLUB XP AWARDED
                </div>
              ) : (
                <form className="club-submit-form" onSubmit={handleChallengeSubmit}>
                  <div className="club-modal__section-title">SUBMIT YOUR SOLUTION:</div>
                  <input
                    type="url"
                    className="club-submit-input"
                    placeholder="GitHub Repository URL (e.g. https://github.com/my-cloud-challenge)..."
                    required
                  />
                  <textarea
                    className="club-submit-textarea"
                    placeholder="Brief architectural design summary & trade-off decisions..."
                    rows="3"
                    required
                  />
                  <button type="submit" className="club-submit-btn">
                    SUBMIT TO LEADERBOARD ▸
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
