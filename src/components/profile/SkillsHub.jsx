/* ============================================
   LOST IN THE CLOUD — 11 Skills Knowledge Hub
   ============================================ */

import React, { useState } from 'react';
import { useGame } from '../../state/GameContext';
import ProgressionEngine from '../../engine/ProgressionEngine';
import './SkillsHub.css';

export default function SkillsHub() {
  const { state } = useGame();
  const [selectedSkill, setSelectedSkill] = useState(null);

  const skills = ProgressionEngine.getSkills(state);

  return (
    <div className="skills-page">
      {/* Top Header */}
      <div className="skills-page__header">
        <div>
          <span className="skills-page__tag">CLOUD ENGINEERING KNOWLEDGE GRAPH</span>
          <h1 className="skills-page__title">11 CORE ARCHITECTURAL SKILL DOMAINS</h1>
        </div>
        <div className="skills-page__stats">
          <span>{state.unlockedConcepts.length} CONCEPTS MASTERED</span>
          <span>•</span>
          <span>{state.completedMissions.length}/10 INCIDENTS TRIAGED</span>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="skills-grid">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className={`skill-card ${selectedSkill?.id === skill.id ? 'skill-card--selected' : ''}`}
            onClick={() => setSelectedSkill(skill)}
          >
            <div className="skill-card__header">
              <div className="skill-card__icon" style={{ borderColor: skill.color }}>
                {skill.icon}
              </div>
              <div className="skill-card__title-box">
                <div className="skill-card__name">{skill.name}</div>
                <div className="skill-card__level-badge" style={{ color: skill.color }}>
                  TIER {skill.level} / 5
                </div>
              </div>
            </div>

            <p className="skill-card__desc">{skill.description}</p>

            {/* Progression Bar */}
            <div className="skill-card__progress">
              <div className="skill-card__progress-labels">
                <span>Concepts: {skill.unlockedCount} of {skill.totalCount}</span>
                <span>{skill.percent}%</span>
              </div>
              <div className="skill-card__bar">
                <div
                  className="skill-card__bar-fill"
                  style={{ width: `${skill.percent}%`, background: skill.color }}
                />
              </div>
            </div>

            {/* Concepts Unlocked in Domain */}
            <div className="skill-card__chips">
              {skill.concepts.map(concept => {
                const isUnlocked = (state.unlockedConcepts || []).includes(concept);
                return (
                  <span
                    key={concept}
                    className={`skill-concept-chip ${isUnlocked ? 'skill-concept-chip--unlocked' : ''}`}
                  >
                    {isUnlocked ? '✓' : '○'} {concept}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Skill Detail Drawer */}
      {selectedSkill && (
        <div className="skill-drawer-overlay" onClick={() => setSelectedSkill(null)}>
          <div className="skill-drawer anim-slide-left" onClick={(e) => e.stopPropagation()}>
            <div className="skill-drawer__header">
              <div className="skill-drawer__icon-large">{selectedSkill.icon}</div>
              <div>
                <span className="skill-drawer__tag">SKILL DEEP DIVE</span>
                <h2 className="skill-drawer__title">{selectedSkill.name}</h2>
                <div className="skill-drawer__tier" style={{ color: selectedSkill.color }}>
                  TIER {selectedSkill.level} MASTERY • {selectedSkill.percent}%
                </div>
              </div>
              <button className="skill-drawer__close" onClick={() => setSelectedSkill(null)}>✕</button>
            </div>

            <div className="skill-drawer__body">
              <div className="skill-drawer__section">
                <div className="skill-drawer__section-title">CORE CURRICULUM CONCEPTS</div>
                <div className="skill-drawer__concepts-list">
                  {selectedSkill.concepts.map(concept => {
                    const isUnlocked = (state.unlockedConcepts || []).includes(concept);
                    return (
                      <div key={concept} className={`skill-concept-row ${isUnlocked ? 'skill-concept-row--done' : ''}`}>
                        <span>{isUnlocked ? '🟢' : '⚪'} {concept}</span>
                        <span className="skill-concept-status">{isUnlocked ? 'MASTERED' : 'LOCKED'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="skill-drawer__section">
                <div className="skill-drawer__section-title">ENGINEERING STRENGTHS</div>
                <p className="skill-drawer__text">{selectedSkill.strengths}</p>
              </div>

              <div className="skill-drawer__section">
                <div className="skill-drawer__section-title">NEXT ARCHITECTURAL MILESTONE</div>
                <div className="skill-drawer__milestone-box">
                  <span>🎯 {selectedSkill.nextMilestone}</span>
                </div>
              </div>

              <div className="skill-drawer__section">
                <div className="skill-drawer__section-title">MISSIONS APPLIED</div>
                <div className="skill-drawer__missions-chips">
                  {selectedSkill.missionsUsed.map(m => (
                    <span key={m} className="skill-mission-chip">{m.replace('_', ' ').toUpperCase()}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
