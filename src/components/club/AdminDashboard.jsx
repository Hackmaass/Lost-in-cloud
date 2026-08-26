/* ============================================
   LOST IN THE CLOUD — Club Leadership Admin Dashboard
   ============================================ */

import React, { useState } from 'react';
import { CLUB_DATA } from '../../data/club/clubData';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [membersList, setMembersList] = useState(CLUB_DATA.leaderboard);
  const [eventsList, setEventsList] = useState(CLUB_DATA.events);
  const [challengesList, setChallengesList] = useState(CLUB_DATA.challenges);

  // Form states
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState('Workshop');
  const [newEventSpeaker, setNewEventSpeaker] = useState('');
  const [newEventSuccess, setNewEventSuccess] = useState(false);

  const [newChallengeTitle, setNewChallengeTitle] = useState('');
  const [newChallengeDiff, setNewChallengeDiff] = useState('Intermediate');
  const [newChallengePts, setNewChallengePts] = useState(250);
  const [newChallengeSuccess, setNewChallengeSuccess] = useState(false);

  const { analytics } = CLUB_DATA;

  const handleRoleChange = (handle, newRole) => {
    setMembersList(prev => prev.map(m => m.handle === handle ? { ...m, role: newRole } : m));
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newEvt = {
      id: `evt_${Date.now()}`,
      title: newEventTitle,
      type: newEventType,
      date: 'Next Week',
      time: '6:00 PM IST',
      location: 'Cloud Lab 2',
      speaker: newEventSpeaker || 'Guest AWS Speaker',
      description: 'Newly scheduled AWS technical session.',
      clubXpReward: 150,
      relatedConcepts: ['Cloud Architecture'],
      registeredCount: 0,
    };

    setEventsList(prev => [newEvt, ...prev]);
    setNewEventSuccess(true);
    setTimeout(() => {
      setNewEventSuccess(false);
      setNewEventTitle('');
      setNewEventSpeaker('');
    }, 2000);
  };

  const handleCreateChallenge = (e) => {
    e.preventDefault();
    if (!newChallengeTitle.trim()) return;

    const newChal = {
      id: `chal_${Date.now()}`,
      title: newChallengeTitle,
      difficulty: newChallengeDiff,
      points: Number(newChallengePts),
      category: 'Cloud Engineering',
      submissionType: 'GitHub Repo + Architecture',
      description: 'Newly published AWS Cloud Club challenge.',
      requirements: ['Scalable multi-AZ architecture', 'Security best practices'],
      completedBy: 0,
    };

    setChallengesList(prev => [newChal, ...prev]);
    setNewChallengeSuccess(true);
    setTimeout(() => {
      setNewChallengeSuccess(false);
      setNewChallengeTitle('');
    }, 2000);
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <div>
          <span className="admin-tag">LEADERSHIP CONTROL CENTER</span>
          <h1 className="admin-title">AWS CLOUD CLUB ADMIN DASHBOARD</h1>
        </div>
        <div className="admin-badge">CHAPTER LEAD ACCESS</div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        {[
          { id: 'analytics', label: '📊 CLUB ANALYTICS' },
          { id: 'members', label: '👥 MEMBER ROLES' },
          { id: 'events', label: '📅 CREATE EVENT' },
          { id: 'challenges', label: '⚡ CREATE CHALLENGE' },
        ].map(tab => (
          <button
            key={tab.id}
            className={`admin-tab-btn ${activeTab === tab.id ? 'admin-tab-btn--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Analytics */}
      {activeTab === 'analytics' && (
        <div className="admin-content anim-fade-in-up">
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <span className="admin-stat-card__val">{analytics.activeMembersThisMonth}</span>
              <span className="admin-stat-card__lbl">Active Members This Month</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-card__val">{analytics.totalEventAttendanceRate}%</span>
              <span className="admin-stat-card__lbl">Event Attendance Rate</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-card__val">{analytics.labsCompletedCount}</span>
              <span className="admin-stat-card__lbl">Labs & Missions Completed</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-card__val">{analytics.challengesSubmittedCount}</span>
              <span className="admin-stat-card__lbl">Challenge Submissions</span>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card__title">STUDENT AWS SKILL DISTRIBUTION (%)</div>
            <div className="admin-skills-bars">
              {Object.entries(analytics.skillDistribution).map(([domain, score]) => (
                <div key={domain} className="admin-skill-bar-row">
                  <span className="admin-skill-label">{domain.toUpperCase()}</span>
                  <div className="admin-skill-bar-track">
                    <div className="admin-skill-bar-fill" style={{ width: `${score}%` }} />
                  </div>
                  <span className="admin-skill-val">{score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Members Directory & Roles */}
      {activeTab === 'members' && (
        <div className="admin-content anim-fade-in-up">
          <div className="admin-card">
            <div className="admin-card__title">CLUB MEMBERS & ROLE MANAGEMENT</div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ENGINEER</th>
                  <th>LEVEL</th>
                  <th>CLUB XP</th>
                  <th>CURRENT ROLE</th>
                  <th>MODIFY ROLE</th>
                </tr>
              </thead>
              <tbody>
                {membersList.map(m => (
                  <tr key={m.handle}>
                    <td>
                      <strong>{m.name}</strong> (@{m.handle})
                    </td>
                    <td>Level {m.level}</td>
                    <td>{m.clubXp} XP</td>
                    <td><span className="role-tag">{m.role}</span></td>
                    <td>
                      <select
                        className="admin-select"
                        value={m.role}
                        onChange={(e) => handleRoleChange(m.handle, e.target.value)}
                      >
                        <option value="Member">Member</option>
                        <option value="Junior Cloud Engineer">Junior Cloud Engineer</option>
                        <option value="Cloud Engineer">Cloud Engineer</option>
                        <option value="Senior Cloud Engineer">Senior Cloud Engineer</option>
                        <option value="Staff Engineer">Staff Engineer</option>
                        <option value="Mentor">Mentor</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Create Event */}
      {activeTab === 'events' && (
        <div className="admin-content anim-fade-in-up">
          <div className="admin-card admin-card--form">
            <div className="admin-card__title">PUBLISH NEW CLUB EVENT</div>
            {newEventSuccess ? (
              <div className="admin-success-box anim-pulse">✓ EVENT PUBLISHED SUCCESSFULLY TO CLUB HUB!</div>
            ) : (
              <form className="admin-form" onSubmit={handleCreateEvent}>
                <label className="admin-label">EVENT TITLE</label>
                <input
                  type="text"
                  className="admin-input"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g. Hands-On AWS CDK Infrastructure As Code Workshop..."
                  required
                />

                <div className="admin-form-row">
                  <div className="admin-form-col">
                    <label className="admin-label">EVENT TYPE</label>
                    <select
                      className="admin-select"
                      value={newEventType}
                      onChange={(e) => setNewEventType(e.target.value)}
                    >
                      <option value="Workshop">Workshop</option>
                      <option value="Cloud Lab">Cloud Lab</option>
                      <option value="Hackathon">Hackathon</option>
                      <option value="Talk">Talk / AMA</option>
                      <option value="Study Session">Study Session</option>
                    </select>
                  </div>

                  <div className="admin-form-col">
                    <label className="admin-label">SPEAKER / INSTRUCTOR</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newEventSpeaker}
                      onChange={(e) => setNewEventSpeaker(e.target.value)}
                      placeholder="e.g. AWS Solutions Architect..."
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="admin-submit-btn">
                  PUBLISH EVENT TO ALL MEMBERS ▸
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Create Challenge */}
      {activeTab === 'challenges' && (
        <div className="admin-content anim-fade-in-up">
          <div className="admin-card admin-card--form">
            <div className="admin-card__title">PUBLISH NEW CLOUD CHALLENGE</div>
            {newChallengeSuccess ? (
              <div className="admin-success-box anim-pulse">✓ CHALLENGE PUBLISHED TO COMPETITION!</div>
            ) : (
              <form className="admin-form" onSubmit={handleCreateChallenge}>
                <label className="admin-label">CHALLENGE TITLE</label>
                <input
                  type="text"
                  className="admin-input"
                  value={newChallengeTitle}
                  onChange={(e) => setNewChallengeTitle(e.target.value)}
                  placeholder="e.g. Multi-AZ Disaster Recovery Failover Architecture..."
                  required
                />

                <div className="admin-form-row">
                  <div className="admin-form-col">
                    <label className="admin-label">DIFFICULTY</label>
                    <select
                      className="admin-select"
                      value={newChallengeDiff}
                      onChange={(e) => setNewChallengeDiff(e.target.value)}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="admin-form-col">
                    <label className="admin-label">POINTS REWARD</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={newChallengePts}
                      onChange={(e) => setNewChallengePts(e.target.value)}
                      min="50"
                      max="1000"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="admin-submit-btn">
                  LAUNCH CHALLENGE TO SEASON 01 ▸
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
