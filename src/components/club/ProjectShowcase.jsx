/* ============================================
   LOST IN THE CLOUD — Student Cloud Projects Showcase
   ============================================ */

import React, { useState } from 'react';
import { useGame } from '../../state/GameContext';
import { CLUB_DATA } from '../../data/club/clubData';
import './ProjectShowcase.css';

export default function ProjectShowcase() {
  const { state, publishProject } = useGame();
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newProblem, setNewProblem] = useState('');
  const [newSolution, setNewSolution] = useState('');
  const [newServices, setNewServices] = useState('AWS Lambda, Amazon S3, Amazon DynamoDB');
  const [newGithub, setNewGithub] = useState('');
  const [publishSuccess, setPublishSuccess] = useState(false);

  const allProjects = [...CLUB_DATA.projects, ...(state.clubProjects || [])];
  const filtered = allProjects.filter(p => filter === 'all' || p.tags?.some(t => t.toLowerCase() === filter.toLowerCase()));

  const handlePublishSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const projectObj = {
      id: `proj_${Date.now()}`,
      name: newTitle,
      author: state.name || 'Verified Student Engineer',
      members: [state.name || 'Student Engineer'],
      tags: newServices.split(',').map(s => s.trim().replace('AWS ', '').replace('Amazon ', '')),
      services: newServices.split(',').map(s => s.trim()),
      problem: newProblem,
      solution: newSolution,
      githubUrl: newGithub || 'https://github.com/aws-cloud-club/student-project',
      demoUrl: 'https://demo.nexoracloud.dev',
      architectureDiagram: [
        '         CLIENT WEB / MOBILE',
        '                  │',
        '                  ▼',
        '        AMAZON API GATEWAY',
        '                  │',
        '                  ▼',
        '             AWS LAMBDA',
        '            /          \\',
        '           ▼            ▼',
        '    AMAZON DYNAMODB   AMAZON S3',
      ],
      likes: 12,
      featured: false,
    };

    publishProject(projectObj);
    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
      setShowSubmitModal(false);
      setNewTitle('');
      setNewProblem('');
      setNewSolution('');
    }, 2000);
  };

  return (
    <div className="projects-page">
      {/* Header */}
      <div className="projects-header">
        <div>
          <span className="projects-tag">PORTFOLIO & SHOWCASE</span>
          <h1 className="projects-title">AWS CLOUD CLUB PROJECTS</h1>
        </div>
        <button className="projects-publish-btn" onClick={() => setShowSubmitModal(true)}>
          + SUBMIT NEW PROJECT
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="projects-filters">
        {['all', 'serverless', 'storage', 'security', 'database'].map(cat => (
          <button
            key={cat}
            className={`projects-filter-btn ${filter === cat ? 'projects-filter-btn--active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filtered.map(proj => (
          <div key={proj.id} className="proj-card" onClick={() => setSelectedProject(proj)}>
            <div className="proj-card__header">
              <span className="proj-card__author">{proj.author}</span>
              {proj.featured && <span className="proj-card__featured-badge">★ FEATURED</span>}
            </div>

            <h3 className="proj-card__title">{proj.name}</h3>
            <p className="proj-card__desc">{proj.solution}</p>

            <div className="proj-card__services">
              {proj.services?.map(srv => (
                <span key={srv} className="proj-service-chip">{srv}</span>
              ))}
            </div>

            <div className="proj-card__footer">
              <span className="proj-card__likes">♥ {proj.likes} endorsements</span>
              <span className="proj-card__cta">INSPECT ARCHITECTURE ▸</span>
            </div>
          </div>
        ))}
      </div>

      {/* Project Architecture & Detail Modal */}
      {selectedProject && (
        <div className="proj-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="proj-modal anim-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="proj-modal__header">
              <div>
                <span className="proj-modal__tag">{selectedProject.author}</span>
                <h2 className="proj-modal__title">{selectedProject.name}</h2>
              </div>
              <button className="proj-modal__close" onClick={() => setSelectedProject(null)}>✕</button>
            </div>

            <div className="proj-modal__body">
              {/* Architecture Diagram Canvas */}
              <div className="proj-arch-box">
                <div className="proj-arch-box__title">SYSTEM ARCHITECTURE TOPOLOGY</div>
                <pre className="proj-arch-diagram">
                  {selectedProject.architectureDiagram?.join('\n')}
                </pre>
              </div>

              <div className="proj-modal__section">
                <div className="proj-modal__section-title">THE ENGINEERING CHALLENGE</div>
                <p className="proj-modal__text">{selectedProject.problem}</p>
              </div>

              <div className="proj-modal__section">
                <div className="proj-modal__section-title">THE CLOUD ARCHITECTURE SOLUTION</div>
                <p className="proj-modal__text">{selectedProject.solution}</p>
              </div>

              <div className="proj-modal__actions">
                {selectedProject.githubUrl && (
                  <a href={selectedProject.githubUrl} target="_blank" rel="noreferrer" className="proj-link-btn">
                    🐙 GITHUB REPOSITORY
                  </a>
                )}
                {selectedProject.demoUrl && (
                  <a href={selectedProject.demoUrl} target="_blank" rel="noreferrer" className="proj-link-btn proj-link-btn--demo">
                    🚀 LAUNCH LIVE DEMO
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Project Modal */}
      {showSubmitModal && (
        <div className="proj-modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="proj-modal anim-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="proj-modal__header">
              <div>
                <span className="proj-modal__tag">AWS CLOUD CLUB PORTFOLIO</span>
                <h2 className="proj-modal__title">PUBLISH YOUR CLOUD PROJECT</h2>
              </div>
              <button className="proj-modal__close" onClick={() => setShowSubmitModal(false)}>✕</button>
            </div>

            <div className="proj-modal__body">
              {publishSuccess ? (
                <div className="proj-publish-success anim-pulse">
                  ✓ PROJECT PUBLISHED TO SHOWCASE! +300 CLUB XP AWARDED
                </div>
              ) : (
                <form className="proj-submit-form" onSubmit={handlePublishSubmit}>
                  <label className="proj-form-label">PROJECT TITLE</label>
                  <input
                    type="text"
                    className="proj-form-input"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Serverless Multi-Region Disaster Recovery Sync..."
                    required
                  />

                  <label className="proj-form-label">AWS SERVICES USED</label>
                  <input
                    type="text"
                    className="proj-form-input"
                    value={newServices}
                    onChange={(e) => setNewServices(e.target.value)}
                    placeholder="e.g. AWS Lambda, Amazon S3, Amazon RDS..."
                    required
                  />

                  <label className="proj-form-label">THE PROBLEM STATEMENT</label>
                  <textarea
                    className="proj-form-textarea"
                    value={newProblem}
                    onChange={(e) => setNewProblem(e.target.value)}
                    placeholder="What infrastructure or application issue were you solving?"
                    rows="2"
                    required
                  />

                  <label className="proj-form-label">THE ARCHITECTURAL SOLUTION</label>
                  <textarea
                    className="proj-form-textarea"
                    value={newSolution}
                    onChange={(e) => setNewSolution(e.target.value)}
                    placeholder="How does your cloud design solve the problem efficiently?"
                    rows="2"
                    required
                  />

                  <label className="proj-form-label">GITHUB REPO URL</label>
                  <input
                    type="url"
                    className="proj-form-input"
                    value={newGithub}
                    onChange={(e) => setNewGithub(e.target.value)}
                    placeholder="https://github.com/myusername/my-cloud-project"
                  />

                  <button type="submit" className="proj-submit-btn">
                    PUBLISH TO COMMUNITY (+300 XP) ▸
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
