/* ============================================
   LOST IN THE CLOUD — Incident Briefing Card
   Contextual problem intro following Lost at SQL philosophy.
   ============================================ */

import React from 'react';
import './IncidentCard.css';

export default function IncidentCard({
  incidentId = 'INCIDENT #1042',
  title = 'PRODUCTION WEBSITE UNAVAILABLE',
  severity = 'danger',
  summary = 'Find the machine serving the website and restore availability.',
  knownFacts = [
    'Website endpoints are returning HTTP 503 Service Unavailable',
    'PostgreSQL Database cluster is online and healthy',
    'Incident began 06:42 ago after an unexpected status change',
  ],
  onInvestigate,
  onOpenArch,
}) {
  return (
    <div className={`incident-card incident-card--${severity} anim-fade-in`}>
      <div className="incident-card__header">
        <div className="incident-card__badge-group">
          <span className="incident-card__badge incident-card__badge--alert">
            <span className="incident-card__pulse-dot" />
            LIVE INCIDENT
          </span>
          <span className="incident-card__id">{incidentId}</span>
        </div>
        <span className="incident-card__time">STARTED 06:42 AGO</span>
      </div>

      <h2 className="incident-card__title">{title}</h2>
      <p className="incident-card__summary">"{summary}"</p>

      <div className="incident-card__divider" />

      <div className="incident-card__facts-section">
        <h4 className="incident-card__section-label">WHAT DO YOU KNOW?</h4>
        <ul className="incident-card__facts-list">
          {knownFacts.map((fact, index) => (
            <li key={index} className="incident-card__fact-item">
              <span className="incident-card__fact-bullet">◆</span>
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="incident-card__actions">
        <button className="incident-card__btn incident-card__btn--primary" onClick={onInvestigate}>
          <span className="incident-card__btn-icon">⚡</span>
          <span>OPEN CLOUD CONSOLE</span>
        </button>

        {onOpenArch && (
          <button className="incident-card__btn incident-card__btn--secondary" onClick={onOpenArch}>
            <span className="incident-card__btn-icon">🗺</span>
            <span>VIEW ARCHITECTURE</span>
          </button>
        )}
      </div>
    </div>
  );
}
