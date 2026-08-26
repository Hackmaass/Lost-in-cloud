/* ============================================
   LOST IN THE CLOUD — AWS Cloud Club Events Hub
   ============================================ */

import React, { useState } from 'react';
import { useGame } from '../../state/GameContext';
import { CLUB_DATA } from '../../data/club/clubData';
import './EventsHub.css';

export default function EventsHub() {
  const { state, registerEvent, unregisterEvent } = useGame();
  const [filter, setFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const registeredList = state.registeredEvents || [];
  const filtered = CLUB_DATA.events.filter(e => filter === 'all' || e.type.toLowerCase() === filter.toLowerCase());

  const handleToggleRsvp = (eventId) => {
    if (registeredList.includes(eventId)) {
      unregisterEvent(eventId);
    } else {
      registerEvent(eventId);
    }
  };

  return (
    <div className="events-page">
      {/* Header */}
      <div className="events-header">
        <div>
          <span className="events-tag">WORKSHOPS & HACKATHONS</span>
          <h1 className="events-title">AWS CLOUD CLUB EVENTS</h1>
        </div>
        <div className="events-registered-count">
          {registeredList.length} EVENT{registeredList.length !== 1 ? 'S' : ''} REGISTERED
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="events-filters">
        {['all', 'workshop', 'hackathon', 'cloud lab', 'talk'].map(cat => (
          <button
            key={cat}
            className={`events-filter-btn ${filter === cat ? 'events-filter-btn--active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="events-grid">
        {filtered.map(evt => {
          const isRegistered = registeredList.includes(evt.id);
          return (
            <div key={evt.id} className="event-card">
              <div className="event-card__header">
                <span className="event-card__type">{evt.type}</span>
                <span className="event-card__date">{evt.date}</span>
              </div>

              <h3 className="event-card__title">{evt.title}</h3>
              <p className="event-card__desc">{evt.description}</p>

              <div className="event-card__info-row">
                <span>⏰ {evt.time}</span>
                <span>📍 {evt.location}</span>
              </div>
              <div className="event-card__info-row">
                <span>🎤 Speaker: {evt.speaker}</span>
              </div>

              <div className="event-card__concepts">
                {evt.relatedConcepts?.map(c => (
                  <span key={c} className="event-concept-chip">{c}</span>
                ))}
              </div>

              <div className="event-card__footer">
                <span className="event-card__xp">+{evt.clubXpReward} CLUB XP</span>
                <button
                  className={`event-rsvp-btn ${isRegistered ? 'event-rsvp-btn--registered' : ''}`}
                  onClick={() => handleToggleRsvp(evt.id)}
                >
                  {isRegistered ? '✓ REGISTERED' : 'RSVP & REGISTER'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
