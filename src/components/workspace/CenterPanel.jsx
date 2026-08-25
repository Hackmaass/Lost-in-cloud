/* ============================================
   LOST IN THE CLOUD — Center Panel
   Primary gameplay area: dialogue, scenes,
   profiles, skills, achievements, settings
   ============================================ */

import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../state/GameContext';
import StoryEngine from '../../engine/StoryEngine';
import { getCharacter } from '../../data/characters';
import './CenterPanel.css';

// ---- Dialogue View ----
function DialogueView() {
  const { state, advanceScene, completeObjective, completeScene, setStoryFlags, addXp, completeMission, addMessage } = useGame();
  const scene = StoryEngine.getCurrentScene(state);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sceneComplete, setSceneComplete] = useState(false);

  // Reset when scene changes
  useEffect(() => {
    setDialogueIndex(0);
    setDisplayedText('');
    setIsTyping(false);
    setSceneComplete(false);
  }, [state.currentScene]);

  // Typewriter effect
  useEffect(() => {
    if (!scene) return;

    if (scene.type === 'dialogue' && scene.dialogue && dialogueIndex < scene.dialogue.length) {
      const line = scene.dialogue[dialogueIndex];
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
      }, 30);

      return () => clearInterval(interval);
    }
  }, [scene, dialogueIndex]);

  const handleAdvanceDialogue = useCallback(() => {
    if (!scene) return;

    if (isTyping) {
      // Skip typing — show full text
      setIsTyping(false);
      if (scene.dialogue && dialogueIndex < scene.dialogue.length) {
        setDisplayedText(scene.dialogue[dialogueIndex].text);
      }
      return;
    }

    if (scene.type === 'dialogue' && scene.dialogue) {
      if (dialogueIndex < scene.dialogue.length - 1) {
        setDialogueIndex(prev => prev + 1);
      } else {
        // Scene complete
        handleSceneComplete();
      }
    }
  }, [scene, dialogueIndex, isTyping]);

  const handleSceneComplete = useCallback(() => {
    if (!scene) return;

    // Complete objective if specified
    if (scene.objectiveComplete) {
      completeObjective(scene.objectiveComplete);
    }

    // Set story flags
    if (scene.storyFlags) {
      setStoryFlags(scene.storyFlags);
    }

    completeScene(scene.id);

    // Handle mission complete scenes
    if (scene.type === 'mission_complete') {
      if (scene.xp) addXp(scene.xp);
      completeMission(state.currentMission, scene.nextMission);
      setSceneComplete(true);
      return;
    }

    // Advance to next scene
    const nextSceneId = StoryEngine.getNextSceneId(state);
    if (nextSceneId) {
      advanceScene(nextSceneId);
    } else {
      setSceneComplete(true);
    }
  }, [scene, state]);

  if (!scene) {
    return (
      <div className="center-empty">
        <div className="center-empty__icon">◈</div>
        <div className="center-empty__title">NEXORA SYSTEMS</div>
        <div className="center-empty__text">Welcome to Infrastructure Engineering.</div>
        <div className="center-empty__hint">Your first assignment is waiting.</div>
      </div>
    );
  }

  // ---- Dialogue Scene ----
  if (scene.type === 'dialogue') {
    const currentLine = scene.dialogue?.[dialogueIndex];
    const character = currentLine ? getCharacter(currentLine.speaker) : null;

    return (
      <div className="center-dialogue" onClick={handleAdvanceDialogue}>
        {character && (
          <div className="center-dialogue__scene anim-fade-in">
            {/* Character info */}
            <div className="center-dialogue__character">
              <div className="center-dialogue__avatar" style={{ borderColor: character.accentColor }}>
                {character.name.charAt(0)}
              </div>
              <div className="center-dialogue__info">
                <div className="center-dialogue__name" style={{ color: character.accentColor }}>
                  {character.name.toUpperCase()}
                </div>
                <div className="center-dialogue__title">{character.title}</div>
              </div>
            </div>

            {/* Dialogue text */}
            <div className="center-dialogue__bubble">
              <p className="center-dialogue__text">
                "{displayedText}"
                {isTyping && <span className="center-dialogue__cursor">|</span>}
              </p>
            </div>

            {/* Continue hint */}
            {!isTyping && (
              <div className="center-dialogue__continue anim-fade-in">
                Click to continue ▸
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ---- Narrative Scene ----
  if (scene.type === 'narrative') {
    return (
      <div className="center-narrative" onClick={handleSceneComplete}>
        <div className="center-narrative__content anim-fade-in-up">
          {scene.text?.map((line, i) => (
            <p key={i} className="center-narrative__line" style={{ animationDelay: `${i * 200}ms` }}>
              {line}
            </p>
          ))}
          {scene.action && (
            <div className="center-narrative__action">
              <div className="center-narrative__hint">{scene.action.hint}</div>
            </div>
          )}
          <div className="center-dialogue__continue anim-fade-in" style={{ animationDelay: '1s' }}>
            Click to continue ▸
          </div>
        </div>
      </div>
    );
  }

  // ---- Terminal Task Scene ----
  if (scene.type === 'terminal_task') {
    return (
      <div className="center-terminal-task anim-fade-in">
        <div className="center-terminal-task__content">
          <div className="center-terminal-task__icon">⬡</div>
          <div className="center-terminal-task__title">TERMINAL TASK</div>
          <div className="center-terminal-task__desc">
            Run the command: <code>{scene.requiredCommand}</code>
          </div>
          <div className="center-terminal-task__hint">
            Use the Cloud Operations Terminal below.
          </div>
        </div>
      </div>
    );
  }

  // ---- Mission Complete Scene ----
  if (scene.type === 'mission_complete') {
    return (
      <div className="center-mission-complete" onClick={handleSceneComplete}>
        <div className="center-mission-complete__content anim-fade-in-up">
          <div className="center-mission-complete__badge">✓</div>
          <div className="center-mission-complete__title">{scene.title}</div>
          <div className="center-mission-complete__subtitle">{scene.subtitle}</div>
          <div className="center-mission-complete__message">{scene.message}</div>
          {scene.xp && (
            <div className="center-mission-complete__xp">+{scene.xp} XP</div>
          )}
          <div className="center-dialogue__continue" style={{ marginTop: '2rem' }}>
            Click to continue ▸
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ---- Profile View ----
function ProfileView() {
  const { state } = useGame();

  return (
    <div className="center-profile anim-fade-in">
      <div className="center-profile__card">
        <div className="center-profile__header">EMPLOYEE PROFILE</div>
        <div className="center-profile__field">
          <span className="center-profile__label">NAME</span>
          <span className="center-profile__value">{state.name}</span>
        </div>
        <div className="center-profile__field">
          <span className="center-profile__label">POSITION</span>
          <span className="center-profile__value">{state.position}</span>
        </div>
        <div className="center-profile__field">
          <span className="center-profile__label">DEPARTMENT</span>
          <span className="center-profile__value">{state.department}</span>
        </div>
        <div className="center-profile__field">
          <span className="center-profile__label">LEVEL</span>
          <span className="center-profile__value">{state.level}</span>
        </div>
        <div className="center-profile__field">
          <span className="center-profile__label">XP</span>
          <span className="center-profile__value center-profile__value--primary">{state.xp}</span>
        </div>
        <div className="center-profile__field">
          <span className="center-profile__label">MISSIONS COMPLETED</span>
          <span className="center-profile__value">{state.completedMissions.length}</span>
        </div>
        <div className="center-profile__field">
          <span className="center-profile__label">DAY</span>
          <span className="center-profile__value">{state.day}</span>
        </div>
      </div>
    </div>
  );
}

// ---- Skills View ----
function SkillsView() {
  const { state } = useGame();
  const concepts = state.unlockedConcepts;

  return (
    <div className="center-skills anim-fade-in">
      <div className="center-skills__header">AWS KNOWLEDGE</div>
      {concepts.length === 0 ? (
        <div className="center-skills__empty">
          <p>No AWS concepts unlocked yet.</p>
          <p className="text-dim">Complete missions to discover cloud technologies.</p>
        </div>
      ) : (
        <div className="center-skills__grid">
          {concepts.map(c => (
            <div key={c} className="center-skills__item">
              <span className="center-skills__item-icon">◆</span>
              <span>{c}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Achievements View ----
function AchievementsView() {
  const { state } = useGame();

  return (
    <div className="center-achievements anim-fade-in">
      <div className="center-achievements__header">ACHIEVEMENTS</div>
      {state.achievements.length === 0 ? (
        <div className="center-achievements__empty">
          <p>No achievements yet.</p>
          <p className="text-dim">Keep solving incidents to earn recognition.</p>
        </div>
      ) : (
        <div className="center-achievements__list">
          {state.achievements.map(a => (
            <div key={a} className="center-achievements__item">★ {a}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Settings View ----
function SettingsView() {
  const { deleteSave } = useGame();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (confirmDelete) {
      deleteSave();
      window.location.reload();
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="center-settings anim-fade-in">
      <div className="center-settings__header">SETTINGS</div>
      <div className="center-settings__section">
        <div className="center-settings__section-title">SAVE DATA</div>
        <button className="center-settings__danger-btn" onClick={handleDelete}>
          {confirmDelete ? 'CONFIRM DELETE — ARE YOU SURE?' : 'DELETE SAVE DATA'}
        </button>
        <p className="center-settings__warning">This will permanently erase all progress.</p>
      </div>
    </div>
  );
}

// ---- Main Center Panel ----
export default function CenterPanel({ activeView }) {
  switch (activeView) {
    case 'mission': return <DialogueView />;
    case 'profile': return <ProfileView />;
    case 'skills': return <SkillsView />;
    case 'achievements': return <AchievementsView />;
    case 'settings': return <SettingsView />;
    default: return <DialogueView />;
  }
}
