/* ============================================
   LOST IN THE CLOUD — Unified Scene & Investigation Stage
   Full-screen contextual narrative experience:
   - Dynamic Environment Backdrops
   - Illustrated Character Portraits & Atmospheric Dialogue
   - Incident Briefings
   - Nexora Cloud Console Investigation
   - Contextual Architecture Topologies & Coworker Clues
   - Performance Debriefs
   ============================================ */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useGame } from '../../state/GameContext';
import StoryEngine from '../../engine/StoryEngine';
import { getCharacter } from '../../data/characters';
import { getEvidence } from '../../data/evidence';
import { getEnvironment } from '../../assets/visuals/environments';
import CloudTerminal from '../terminal/CloudTerminal';
import IncidentCard from './IncidentCard';
import CoworkerHintModal from './CoworkerHintModal';
import ArchitectureMap from '../infrastructure/ArchitectureMap';
import AudioManager from '../../engine/AudioManager';
import './CenterPanel.css';

export default function CenterPanel() {
  const {
    state,
    advanceScene,
    completeObjective,
    completeScene,
    setStoryFlags,
    addXp,
    completeMission,
    setMissionRating,
    unlockConcepts,
    unlockConcept,
    setDay,
  } = useGame();

  const scene = StoryEngine.getCurrentScene(state);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showArchModal, setShowArchModal] = useState(false);
  const [showCoworkerModal, setShowCoworkerModal] = useState(false);
  const [consoleExpanded, setConsoleExpanded] = useState(false);

  // Dynamic dialogue resolution
  const dialogueList = useMemo(() => {
    if (!scene) return [];
    return StoryEngine.resolveSceneDialogue(scene, state);
  }, [scene, state.storyFlags]);

  // Reset when scene changes
  useEffect(() => {
    setDialogueIndex(0);
    setDisplayedText('');
    setIsTyping(false);
  }, [state.currentScene]);

  // Scene completion transition
  const handleSceneComplete = useCallback(() => {
    if (!scene) return;

    if (scene.objectiveComplete) {
      completeObjective(scene.objectiveComplete);
    }
    if (scene.storyFlags) {
      setStoryFlags(scene.storyFlags);
    }
    if (scene.unlocks && Array.isArray(scene.unlocks)) {
      unlockConcepts(scene.unlocks);
    } else if (scene.unlocks && typeof scene.unlocks === 'string') {
      unlockConcept(scene.unlocks);
    }

    completeScene(scene.id);

    // Debrief / mission completion transition
    if (scene.type === 'debrief' || scene.type === 'mission_complete') {
      if (scene.xp) addXp(scene.xp);
      if (scene.ratings) {
        setMissionRating(state.currentMission, scene.ratings);
      }

      if (scene.nextMission) {
        const nextMissionObj = StoryEngine.getMission(state.currentAct, scene.nextMission);
        if (nextMissionObj) {
          if (nextMissionObj.day) setDay(nextMissionObj.day);
          const firstScene = nextMissionObj.scenes[0]?.id;
          completeMission(state.currentMission, scene.nextMission, firstScene);
          return;
        }
      }
    }

    const nextSceneId = StoryEngine.getNextSceneId(state);
    if (nextSceneId) {
      advanceScene(nextSceneId);
    }
  }, [scene, state, completeObjective, setStoryFlags, unlockConcepts, unlockConcept, completeScene, addXp, setMissionRating, setDay, completeMission, advanceScene]);

  // Typewriter effect for dialogue
  useEffect(() => {
    if (!scene || scene.type !== 'dialogue' || !dialogueList || dialogueIndex >= dialogueList.length) return;

    const line = dialogueList[dialogueIndex];
    let charIdx = 0;
    setIsTyping(true);
    setDisplayedText('');

    const interval = setInterval(() => {
      charIdx++;
      setDisplayedText(line.text.substring(0, charIdx));
      if (charIdx >= line.text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 22);

    return () => clearInterval(interval);
  }, [scene, dialogueIndex, dialogueList]);

  // Advance dialogue
  const handleAdvanceDialogue = useCallback(() => {
    if (!scene) return;

    if (isTyping) {
      setIsTyping(false);
      if (dialogueList && dialogueIndex < dialogueList.length) {
        setDisplayedText(dialogueList[dialogueIndex].text);
      }
      return;
    }

    AudioManager.play('dialogue_advance');

    if (scene.type === 'dialogue' && dialogueList) {
      if (dialogueIndex < dialogueList.length - 1) {
        setDialogueIndex(prev => prev + 1);
      } else {
        handleSceneComplete();
      }
    }
  }, [scene, dialogueIndex, isTyping, dialogueList, handleSceneComplete]);

  // Resolve Environment Backdrop
  const envKey = scene?.environment || (scene?.type === 'alert' ? 'incident_room' : scene?.type === 'terminal_task' ? 'workstation' : 'office_day');
  const envObj = getEnvironment(envKey);

  if (!scene) {
    return (
      <div className="scene-stage scene-stage--empty">
        <div className="scene-empty-card">
          <div className="scene-empty-card__icon">◈</div>
          <h2>NEXORA SYSTEMS</h2>
          <p>All scheduled operations completed for today.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="scene-stage">
      {/* 1. Dynamic Environment Backdrop */}
      <div className="scene-stage__backdrop">
        {envObj.svg()}
        <div className="scene-stage__backdrop-overlay" />
      </div>

      {/* 2. Primary Scene Content Container */}
      <div className="scene-stage__content-container">
        {/* ---- A. DIALOGUE SCENE ---- */}
        {scene.type === 'dialogue' && (
          <div className="scene-dialogue-view" onClick={handleAdvanceDialogue}>
            {(() => {
              const currentLine = dialogueList?.[dialogueIndex];
              const character = currentLine ? getCharacter(currentLine.speaker) : null;

              return (
                <>
                  {/* Character Illustrated Portrait */}
                  {character && (
                    <div className="scene-dialogue-view__portrait anim-fade-in" style={{ '--char-accent': character.accentColor }}>
                      <div className="scene-portrait-card">
                        <div className="scene-portrait-card__graphic">
                          {character.renderAvatar && character.renderAvatar('neutral')}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Speech Bubble */}
                  <div className="scene-dialogue-view__bubble anim-fade-in">
                    <div className="scene-bubble-header">
                      <span className="scene-bubble-name" style={{ color: character?.accentColor }}>
                        {character?.name.toUpperCase()}
                      </span>
                      <span className="scene-bubble-title">{character?.title}</span>
                    </div>

                    <p className="scene-bubble-text">
                      "{displayedText}"
                      {isTyping && <span className="scene-bubble-cursor">|</span>}
                    </p>

                    <div className="scene-bubble-footer">
                      <span className="scene-bubble-tip">
                        {isTyping ? 'Click to show text' : 'Click anywhere to continue'}
                      </span>
                      <button className="scene-bubble-btn" onClick={e => { e.stopPropagation(); handleAdvanceDialogue(); }}>
                        CONTINUE →
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* ---- B. NARRATIVE SCENE ---- */}
        {scene.type === 'narrative' && (
          <div className="scene-narrative-view anim-fade-in">
            <div className="scene-narrative-card">
              <div className="scene-narrative-card__badge">ORIENTATION</div>
              <div className="scene-narrative-card__body">
                {scene.text?.map((paragraph, idx) => (
                  <p key={idx} className="scene-narrative-paragraph">{paragraph}</p>
                ))}
              </div>
              <div className="scene-narrative-card__actions">
                <button className="scene-btn scene-btn--primary" onClick={handleSceneComplete}>
                  {scene.action?.hint ? 'OPEN CLOUD CONSOLE →' : 'CONTINUE →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---- C. ALERT / INCIDENT SCENE ---- */}
        {scene.type === 'alert' && (
          <div className="scene-alert-view anim-fade-in">
            <IncidentCard
              incidentId={scene.title || 'INCIDENT #1042'}
              title={scene.title || 'PRODUCTION WEBSITE UNAVAILABLE'}
              severity={scene.severity || 'danger'}
              summary={scene.message || 'Service degradation detected in production.'}
              onInvestigate={handleSceneComplete}
              onOpenArch={() => setShowArchModal(true)}
            />
          </div>
        )}

        {/* ---- D. TERMINAL TASK / INVESTIGATION SCENE ---- */}
        {scene.type === 'terminal_task' && (
          <div className="scene-investigation-view anim-fade-in">
            {/* Top Context Bar */}
            <div className="scene-investigation-bar">
              <div className="scene-investigation-bar__objective">
                <span className="scene-investigation-bar__icon">⚡</span>
                <span className="scene-investigation-bar__text">
                  COMMAND OBJECTIVE: Type <code>{scene.requiredCommand}</code>
                </span>
              </div>

              <div className="scene-investigation-bar__tools">
                <button
                  className="scene-tool-btn"
                  onClick={() => setShowArchModal(true)}
                  title="Inspect Architecture Map"
                >
                  <span>🗺 Architecture</span>
                </button>
                <button
                  className="scene-tool-btn scene-tool-btn--coworker"
                  onClick={() => setShowCoworkerModal(true)}
                  title="Ask Arjun for a clue"
                >
                  <span>💬 Ask Arjun</span>
                </button>
              </div>
            </div>

            {/* Cloud Console Workbench */}
            <div className="scene-investigation-terminal">
              <CloudTerminal
                isStandalone={false}
                isExpanded={consoleExpanded}
                onToggleExpand={() => setConsoleExpanded(prev => !prev)}
              />
            </div>
          </div>
        )}

        {/* ---- E. EVIDENCE REVEAL SCENE ---- */}
        {scene.type === 'evidence' && (
          <div className="scene-evidence-view anim-fade-in">
            {(() => {
              const ev = getEvidence(scene.evidenceId);
              return (
                <div className="scene-evidence-card">
                  <div className="scene-evidence-card__header">
                    <span className="scene-evidence-badge">CRITICAL EVIDENCE DISCOVERED</span>
                    <span className="scene-evidence-id">{ev?.id || 'EVT_0317'}</span>
                  </div>

                  <h3 className="scene-evidence-title">{ev?.title || '03:17:04 CloudTrail Anomaly'}</h3>
                  <p className="scene-evidence-desc">{ev?.description}</p>

                  <div className="scene-evidence-log-box">
                    <pre>{ev?.content || '03:17:04 UTC USER: nexora-deploy-old ACTION: ec2:RebootInstances SOURCE_IP: 198.51.100.42'}</pre>
                  </div>

                  <div className="scene-evidence-actions">
                    <button className="scene-btn scene-btn--primary" onClick={handleSceneComplete}>
                      LOG EVIDENCE & CONTINUE →
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ---- F. DEBRIEF / MISSION COMPLETE SCENE ---- */}
        {(scene.type === 'debrief' || scene.type === 'mission_complete') && (
          <div className="scene-debrief-view anim-fade-in">
            <div className="scene-debrief-card">
              <div className="scene-debrief-card__badge">MISSION RESOLVED</div>
              <h2 className="scene-debrief-title">{scene.title || 'MISSION COMPLETE'}</h2>
              <p className="scene-debrief-subtitle">{scene.subtitle}</p>

              <p className="scene-debrief-msg">{scene.message}</p>

              {/* Assessment Quote */}
              {scene.assessment && (
                <div className="scene-debrief-quote">
                  <div className="scene-debrief-quote__speaker">MAYA CHEN:</div>
                  <p>"{scene.assessment.text}"</p>
                </div>
              )}

              {/* Ratings Grid */}
              {scene.ratings && (
                <div className="scene-debrief-ratings">
                  {Object.entries(scene.ratings).map(([key, val]) => (
                    <div key={key} className="scene-rating-box">
                      <span className="scene-rating-box__label">{key.toUpperCase()}</span>
                      <span className="scene-rating-box__val">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="scene-debrief-actions">
                <button className="scene-btn scene-btn--primary" onClick={handleSceneComplete}>
                  CONTINUE CAREER →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Modals & Sidecars */}
      {showArchModal && (
        <div className="scene-modal-backdrop" onClick={() => setShowArchModal(false)}>
          <div className="scene-modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="scene-modal-header">
              <h3>NEXORA TOPOLOGY ARCHITECTURE</h3>
              <button className="scene-modal-close" onClick={() => setShowArchModal(false)}>✕</button>
            </div>
            <div className="scene-modal-body">
              <ArchitectureMap />
            </div>
          </div>
        </div>
      )}

      {showCoworkerModal && (
        <CoworkerHintModal
          gameState={state}
          onClose={() => setShowCoworkerModal(false)}
        />
      )}
    </div>
  );
}
