/* ============================================
   LOST IN THE CLOUD — AWS Cloud Club Leaderboard
   ============================================ */

import React, { useState } from 'react';
import { useGame } from '../../state/GameContext';
import { CLUB_DATA } from '../../data/club/clubData';
import ProgressionEngine from '../../engine/ProgressionEngine';
import './Leaderboard.css';

export default function Leaderboard() {
  const { state } = useGame();
  const [category, setCategory] = useState('overall');

  const rankInfo = ProgressionEngine.getRank(state);
  const totalPlayerXp = state.xp + (state.clubXp || 450);

  // Compute sorted list based on category
  let sorted = [...CLUB_DATA.leaderboard];
  if (category === 'skills') {
    sorted.sort((a, b) => b.level - a.level);
  } else if (category === 'challenges') {
    sorted.sort((a, b) => b.challenges - a.challenges);
  } else if (category === 'projects') {
    sorted.sort((a, b) => b.projects - a.projects);
  } else if (category === 'community') {
    sorted.sort((a, b) => b.clubXp - a.clubXp);
  } else {
    sorted.sort((a, b) => b.xp - a.xp);
  }

  // Determine player rank
  const playerRankIndex = sorted.findIndex(m => totalPlayerXp > m.xp);
  const playerRank = playerRankIndex === -1 ? sorted.length + 1 : playerRankIndex + 1;

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className="leaderboard-page">
      {/* Header */}
      <div className="leaderboard-header">
        <div>
          <span className="leaderboard-tag">SEASON 01 COMPETITION</span>
          <h1 className="leaderboard-title">AWS CLOUD CLUB LEADERBOARD</h1>
        </div>
        <div className="leaderboard-season-tag">THE FIRST DEPLOYMENT</div>
      </div>

      {/* Category Filter Pills */}
      <div className="leaderboard-categories">
        {[
          { id: 'overall', label: 'OVERALL XP' },
          { id: 'skills', label: 'CLOUD SKILLS' },
          { id: 'challenges', label: 'CHALLENGES' },
          { id: 'projects', label: 'PROJECTS' },
          { id: 'community', label: 'COMMUNITY' },
        ].map(cat => (
          <button
            key={cat.id}
            className={`leaderboard-cat-btn ${category === cat.id ? 'leaderboard-cat-btn--active' : ''}`}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="leaderboard-podium">
        {/* Silver #2 */}
        {top3[1] && (
          <div className="podium-card podium-card--silver">
            <div className="podium-rank">2</div>
            <div className="podium-avatar">{top3[1].avatar}</div>
            <div className="podium-name">{top3[1].name}</div>
            <div className="podium-role">{top3[1].role}</div>
            <div className="podium-xp">{top3[1].xp.toLocaleString()} XP</div>
          </div>
        )}

        {/* Gold #1 */}
        {top3[0] && (
          <div className="podium-card podium-card--gold">
            <div className="podium-crown">👑</div>
            <div className="podium-rank">1</div>
            <div className="podium-avatar">{top3[0].avatar}</div>
            <div className="podium-name">{top3[0].name}</div>
            <div className="podium-role">{top3[0].role}</div>
            <div className="podium-xp">{top3[0].xp.toLocaleString()} XP</div>
          </div>
        )}

        {/* Bronze #3 */}
        {top3[2] && (
          <div className="podium-card podium-card--bronze">
            <div className="podium-rank">3</div>
            <div className="podium-avatar">{top3[2].avatar}</div>
            <div className="podium-name">{top3[2].name}</div>
            <div className="podium-role">{top3[2].role}</div>
            <div className="podium-xp">{top3[2].xp.toLocaleString()} XP</div>
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="leaderboard-table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>RANK</th>
              <th>ENGINEER</th>
              <th>ROLE / TIER</th>
              <th>LEVEL</th>
              <th>CHALLENGES</th>
              <th>PROJECTS</th>
              <th style={{ textAlign: 'right' }}>TOTAL XP</th>
            </tr>
          </thead>
          <tbody>
            {rest.map((member, idx) => (
              <tr key={member.handle}>
                <td className="col-rank">#{idx + 4}</td>
                <td className="col-user">
                  <span className="user-avatar">{member.avatar}</span>
                  <div>
                    <div className="user-name">{member.name}</div>
                    <div className="user-handle">@{member.handle}</div>
                  </div>
                </td>
                <td className="col-role">{member.role}</td>
                <td className="col-level">Level {member.level}</td>
                <td className="col-stat">{member.challenges}</td>
                <td className="col-stat">{member.projects}</td>
                <td className="col-xp">{member.xp.toLocaleString()} XP</td>
              </tr>
            ))}

            {/* Pinned "MY POSITION" Row */}
            <tr className="leaderboard-my-row">
              <td className="col-rank">#{playerRank}</td>
              <td className="col-user">
                <span className="user-avatar">⭐</span>
                <div>
                  <div className="user-name">{state.name || 'You'} (YOU)</div>
                  <div className="user-handle">@{state.displayName || 'engineer'}</div>
                </div>
              </td>
              <td className="col-role">{rankInfo.current.title}</td>
              <td className="col-level">Level {state.level}</td>
              <td className="col-stat">{(state.completedChallenges || []).length}</td>
              <td className="col-stat">{(state.clubProjects || []).length}</td>
              <td className="col-xp">{totalPlayerXp.toLocaleString()} XP</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
