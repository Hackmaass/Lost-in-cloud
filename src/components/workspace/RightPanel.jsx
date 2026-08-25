/* ============================================
   LOST IN THE CLOUD — Right Panel
   Team messages, notifications, alerts
   ============================================ */

import React, { useEffect } from 'react';
import { useGame } from '../../state/GameContext';
import { getCharacter } from '../../data/characters';
import './RightPanel.css';

// Seed initial messages on mount
const INITIAL_MESSAGES = [
  {
    character: 'system',
    text: 'Welcome to Nexora Systems. Your workstation has been provisioned.',
    type: 'system',
  },
  {
    character: 'daniel',
    text: 'Hey new person! 👋 Welcome to the team. If anything breaks, it wasn\'t me.',
    type: 'direct',
  },
  {
    character: 'maya',
    text: 'I\'ve assigned your first briefing. Check the mission panel when ready.',
    type: 'direct',
  },
];

export default function RightPanel() {
  const { state, addMessage, markMessagesRead } = useGame();

  // Seed messages on first render if empty
  useEffect(() => {
    if (state.messages.length === 0) {
      INITIAL_MESSAGES.forEach((msg, i) => {
        setTimeout(() => addMessage(msg), i * 200);
      });
    }
  }, []);

  const handlePanelClick = () => {
    if (state.unreadMessages > 0) {
      markMessagesRead();
    }
  };

  return (
    <div className="rpanel" onClick={handlePanelClick}>
      <div className="rpanel__header">
        <span className="rpanel__header-title">COMMUNICATIONS</span>
        {state.unreadMessages > 0 && (
          <span className="rpanel__unread">{state.unreadMessages}</span>
        )}
      </div>

      <div className="rpanel__divider" />

      {/* System Alerts */}
      <div className="rpanel__section">
        <div className="rpanel__section-label">SYSTEM STATUS</div>
        <div className="rpanel__status-grid">
          <StatusIndicator label="WEB" status="online" />
          <StatusIndicator label="DATABASE" status="online" />
          <StatusIndicator label="STORAGE" status="online" />
          <StatusIndicator label="NETWORK" status="online" />
        </div>
      </div>

      <div className="rpanel__divider" />

      {/* Messages */}
      <div className="rpanel__section rpanel__messages">
        <div className="rpanel__section-label">MESSAGES</div>
        <div className="rpanel__message-list">
          {state.messages.map((msg, i) => {
            const character = getCharacter(msg.character);
            return (
              <div
                key={msg.id || i}
                className={`rpanel__message ${!msg.read ? 'rpanel__message--unread' : ''}`}
              >
                <div className="rpanel__message-header">
                  <span className="rpanel__message-sender" style={{ color: character.accentColor }}>
                    {character.name}
                  </span>
                  <span className="rpanel__message-time">
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    }) : ''}
                  </span>
                </div>
                <div className="rpanel__message-text">{msg.text}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rpanel__divider" />

      {/* Info */}
      <div className="rpanel__section">
        <div className="rpanel__section-label">INFORMATION</div>
        <div className="rpanel__info-card">
          <div className="rpanel__info-title">NEXORA CLOUD</div>
          <div className="rpanel__info-text">
            All production systems are operating within normal parameters.
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusIndicator({ label, status }) {
  const statusClass = status === 'online' ? 'status--online' : status === 'warning' ? 'status--warning' : 'status--danger';

  return (
    <div className={`rpanel__status-item ${statusClass}`}>
      <span className="rpanel__status-dot" />
      <span className="rpanel__status-label">{label}</span>
      <span className="rpanel__status-value">{status.toUpperCase()}</span>
    </div>
  );
}
