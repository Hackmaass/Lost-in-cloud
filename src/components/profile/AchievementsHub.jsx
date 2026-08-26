/* ============================================
   LOST IN THE CLOUD — Achievements Showcase Hub
   ============================================ */

import React, { useState } from 'react';
import { useGame } from '../../state/GameContext';
import { ACHIEVEMENTS } from '../../data/progression/achievements';
import './AchievementsHub.css';

export default function AchievementsHub() {
  const { state } = useGame();
  const [filter, setFilter] = useState('all');

  const unlockedList = state.achievements || [];
  const filtered = ACHIEVEMENTS.filter(a => filter === 'all' || a.category === filter);

  const unlockedCount = ACHIEVEMENTS.filter(a => unlockedList.includes(a.id) || unlockedList.includes(a.title)).length;
  const totalXP = ACHIEVEMENTS.reduce((acc, a) => (unlockedList.includes(a.id) || unlockedList.includes(a.title) ? acc + a.xp : acc), 0);

  return (
    <div className="achievements-page">
      {/* Header */}
      <div className="achievements-page__header">
        <div>
          <span className="achievements-page__tag">COMMENDATIONS & HONORS</span>
          <h1 className="achievements-page__title">ENGINEERING ACHIEVEMENTS</h1>
        </div>
        <div className="achievements-page__stats">
          <span>{unlockedCount} OF {ACHIEVEMENTS.length} UNLOCKED</span>
          <span>•</span>
          <span className="achievements-page__xp">+{totalXP} XP EARNED</span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="achievements-filters">
        {['all', 'operations', 'security', 'reliability', 'architecture', 'learning', 'club'].map(cat => (
          <button
            key={cat}
            className={`achievements-filter-btn ${filter === cat ? 'achievements-filter-btn--active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="achievements-grid">
        {filtered.map((ach) => {
          const isUnlocked = unlockedList.includes(ach.id) || unlockedList.includes(ach.title);
          return (
            <div
              key={ach.id}
              className={`ach-card ${isUnlocked ? 'ach-card--unlocked' : 'ach-card--locked'}`}
            >
              <div className="ach-card__icon-box">
                <span className="ach-card__icon">{ach.icon}</span>
              </div>

              <div className="ach-card__content">
                <div className="ach-card__header">
                  <span className="ach-card__title">{ach.title}</span>
                  <span className={`ach-card__rarity rarity--${ach.rarity.toLowerCase()}`}>
                    {ach.rarity.toUpperCase()}
                  </span>
                </div>

                <p className="ach-card__desc">{ach.description}</p>

                <div className="ach-card__footer">
                  <span className="ach-card__xp">+{ach.xp} XP</span>
                  <span className="ach-card__status">
                    {isUnlocked ? '✓ COMMENDED' : '🔒 LOCKED'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
