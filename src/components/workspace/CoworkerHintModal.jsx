/* ============================================
   LOST IN THE CLOUD — Coworker Investigation Dialog
   Natural coworker guidance (Arjun / Maya / Lena)
   replaces generic chatbot tabs.
   ============================================ */

import React, { useState } from 'react';
import { getCharacter } from '../../data/characters';
import MentorEngine from '../../engine/MentorEngine';
import AudioManager from '../../engine/AudioManager';
import './CoworkerHintModal.css';

export default function CoworkerHintModal({ gameState, onClose, onExecuteCommand }) {
  const [hintTier, setHintTier] = useState(1);
  const [dialogueOpen, setDialogueOpen] = useState(true);

  const coworker = getCharacter('arjun');
  const hint = MentorEngine.getProgressiveHint(gameState, hintTier);

  const handleNextHint = () => {
    AudioManager.play('mentor_hint');
    setHintTier(prev => Math.min(prev + 1, 3));
  };

  const handleApplyCommand = (cmd) => {
    if (onExecuteCommand) {
      onExecuteCommand(cmd);
    }
    onClose();
  };

  return (
    <div className="coworker-modal-backdrop" onClick={onClose}>
      <div className="coworker-modal anim-fade-in" onClick={e => e.stopPropagation()}>
        {/* Coworker Header */}
        <div className="coworker-modal__header">
          <div className="coworker-modal__identity">
            <div className="coworker-modal__avatar-wrap" style={{ borderColor: coworker.accentColor }}>
              {coworker.renderAvatar && coworker.renderAvatar('neutral')}
            </div>
            <div>
              <div className="coworker-modal__name" style={{ color: coworker.accentColor }}>
                {coworker.name.toUpperCase()}
              </div>
              <div className="coworker-modal__title">{coworker.title} • {coworker.department}</div>
            </div>
          </div>
          <button className="coworker-modal__close" onClick={onClose}>✕</button>
        </div>

        {/* Coworker Dialogue Bubble */}
        <div className="coworker-modal__dialogue-body">
          <p className="coworker-modal__speech">
            {hintTier === 1 && `"You're looking at the incident. What have you checked so far?"`}
            {hintTier === 2 && `"Think about what AWS service manages virtual servers. Have you checked the instance list?"`}
            {hintTier === 3 && `"Try running: ${hint.command || 'ec2 list'} in the Cloud Console."`}
          </p>

          <div className="coworker-modal__hint-box">
            <div className="coworker-modal__hint-label">COWORKER CLUE #{hintTier}:</div>
            <div className="coworker-modal__hint-text">{hint.text}</div>
            {hint.command && (
              <div className="coworker-modal__hint-cmd" onClick={() => handleApplyCommand(hint.command)}>
                <code>&gt; {hint.command}</code>
                <span className="coworker-modal__run-chip">Run in Console ↵</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="coworker-modal__footer">
          {hintTier < 3 ? (
            <button className="coworker-modal__btn coworker-modal__btn--secondary" onClick={handleNextHint}>
              <span>Ask for more specifics ({hintTier}/3) →</span>
            </button>
          ) : (
            <span className="coworker-modal__max-hint">Direct clue provided</span>
          )}
          <button className="coworker-modal__btn coworker-modal__btn--primary" onClick={onClose}>
            Back to Investigation
          </button>
        </div>
      </div>
    </div>
  );
}
