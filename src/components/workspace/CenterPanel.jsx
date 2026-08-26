/* ============================================
   LOST IN THE CLOUD — Unified Scene & Investigation Stage
   Lost at SQL Benchmark:
   - Fullscreen Dialogue / Narrative Scenes
   - Side-by-Side Incident & Console Investigation Workbench
   - Immediate Story Progression upon Command Execution
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
  const currentMission = StoryEngine.getCurrentMission(state);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showArchModal, setShowArchModal] = useState(false);
  const [showCoworkerModal, setShowCoworkerModal] = useState(false);

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
    }, 20);

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
          <p>All scheduled investigations completed for today.</p>
        </div>
      </div>
    );
  }

  const isInvestigationMode = scene.type === 'terminal_task' || scene.type === 'learning';

  return (
    <div className="scene-stage">
      {/* 1. Dynamic Environment Backdrop */}
      <div className="scene-stage__backdrop">
        {envObj.svg()}
        <div className="scene-stage__backdrop-overlay" />
      </div>

      {/* 2. Main Narrative & Investigation Viewport */}
      <div className={`scene-stage__content-container ${isInvestigationMode ? 'scene-stage__content-container--split' : ''}`}>
        
        {/* ---- CASE A: PURE DIALOGUE SCENE (Full stage) ---- */}
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
                      <span className="scene-bubble-title">{character?.title} // {character?.department}</span>
                    </div>

                    <p className="scene-bubble-text">
                      "{displayedText}"
                      {isTyping && <span className="scene-bubble-cursor">|</span>}
                    </p>

                    <div className="scene-bubble-footer">
                      <span className="scene-bubble-tip">
                        {isTyping ? 'Click to skip typing' : 'Click anywhere to continue →'}
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

        {/* ---- CASE B: NARRATIVE ORIENTATION (Full stage) ---- */}
        {scene.type === 'narrative' && (
          <div className="scene-narrative-view anim-fade-in">
            <div className="scene-narrative-card">
              <div className="scene-narrative-card__badge">ORIENTATION // NEXORA SYSTEMS</div>
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

        {/* ---- CASE C: LIVE INCIDENT ALERT (Full stage) ---- */}
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

        {/* ---- CASE D: LOST AT SQL STYLE SPLIT INVESTIGATION (Left: Story/Briefing, Right: Console) ---- */}
        {isInvestigationMode && (
          <div className="split-investigation-layout anim-fade-in">
            {/* Left Column: Story, Briefing, Facts & Coworker Guidance */}
            <div className="split-investigation__left">
              <div className="investigation-briefing-card">
                <div className="investigation-briefing__header">
                  <span className="investigation-briefing__badge">ACTIVE INVESTIGATION</span>
                  <span className="investigation-briefing__day">DAY 0{state.day || 1}</span>
                </div>

                <h3 className="investigation-briefing__title">
                  {currentMission?.title || 'PRODUCTION INVESTIGATION'}
                </h3>

                {/* Directive */}
                <div className="investigation-briefing__goal">
                  <div className="investigation-briefing__speaker">DIRECTIVE // MAYA CHEN:</div>
                  <p className="investigation-briefing__prompt">
                    {scene.description || (scene.concept ? `Learn ${scene.concept} and inspect resources.` : 'Investigate the anomaly using Nexora Cloud Console commands.')}
                  </p>
                </div>

                {/* Helpful Instruction / Target */}
                {scene.requiredCommand && (
                  <div className="investigation-briefing__target">
                    <span className="investigation-target-label">SUGGESTED COMMAND:</span>
                    <code>&gt; {scene.requiredCommand}</code>
                  </div>
                )}

                {/* Tools Toolbar */}
                <div className="investigation-briefing__tools">
                  <button
                    className="investigation-tool-btn"
                    onClick={() => setShowArchModal(true)}
                  >
                    <span>🗺 Architecture Map</span>
                  </button>
                  <button
                    className="investigation-tool-btn investigation-tool-btn--coworker"
                    onClick={() => setShowCoworkerModal(true)}
                  >
                    <span>💬 Ask Arjun for Hint</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Nexora Cloud Console */}
            <div className="split-investigation__right">
              <CloudTerminal isStandalone={false} />
            </div>
          </div>
        )}

        {/* ---- CASE E: EVIDENCE REVEAL SCENE ---- */}
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
                      LOG EVIDENCE & CONTINUE STORY →
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ---- CASE F: DEBRIEF / MISSION COMPLETE SCENE ---- */}
        {(scene.type === 'debrief' || scene.type === 'mission_complete') && (
          <div className="scene-debrief-view anim-fade-in">
            <div className="scene-debrief-card">
              <div className="scene-debrief-card__badge">INCIDENT RESOLVED</div>
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
                  NEXT DAY / MISSION →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Architecture Modal */}
      {showArchModal && (
        <div className="scene-modal-backdrop" onClick={() => setShowArchModal(false)}>
          <div className="scene-modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="scene-modal-header">
              <h3>NEXORA CLOUD ARCHITECTURE TOPOLOGY</h3>
              <button className="scene-modal-close" onClick={() => setShowArchModal(false)}>✕</button>
            </div>
            <div className="scene-modal-body">
              <ArchitectureMap />
            </div>
          </div>
        </div>
      )}

      {/* 4. Coworker Hint Modal */}
      {showCoworkerModal && (
        <CoworkerHintModal
          gameState={state}
          onClose={() => setShowCoworkerModal(false)}
        />
      )}
    </div>
  );
}
