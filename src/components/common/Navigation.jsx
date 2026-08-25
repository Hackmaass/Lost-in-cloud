/* ============================================
   LOST IN THE CLOUD — Navigation
   ============================================ */

import React from 'react';
import { useGame } from '../../state/GameContext';
import GAME_CONFIG from '../../data/config';
import './Navigation.css';

const NAV_ITEMS = [
  { id: 'mission', label: 'CURRENT MISSION', icon: '◆' },
  { id: 'messages', label: 'MESSAGES', icon: '✉' },
  { id: 'profile', label: 'PROFILE', icon: '●' },
  { id: 'skills', label: 'SKILLS', icon: '⬡' },
  { id: 'achievements', label: 'ACHIEVEMENTS', icon: '★' },
  { id: 'settings', label: 'SETTINGS', icon: '⚙' },
];

export default function Navigation({ activeItem, onNavigate }) {
  const { state } = useGame();

  return (
    <nav className="nav">
      <div className="nav__brand">
        <span className="nav__brand-icon">◈</span>
        <span className="nav__brand-text">{GAME_CONFIG.company.name}</span>
      </div>

      <div className="nav__items">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav__item ${activeItem === item.id ? 'nav__item--active' : ''} ${item.id === 'mission' ? 'nav__item--primary' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav__item-icon">{item.icon}</span>
            <span className="nav__item-label">{item.label}</span>
            {item.id === 'messages' && state.unreadMessages > 0 && (
              <span className="nav__badge">{state.unreadMessages}</span>
            )}
          </button>
        ))}
      </div>

      <div className="nav__player">
        <span className="nav__player-name">{state.displayName || state.name}</span>
        <span className="nav__player-xp">{state.xp} XP</span>
      </div>
    </nav>
  );
}
