/* ============================================
   LOST IN THE CLOUD — Animation System
   ============================================
   Programmatic animation helpers that
   complement CSS animations.
   ============================================ */

import GAME_CONFIG from '../data/config';

/**
 * Typewriter text reveal — returns a promise that resolves when complete.
 * Calls onUpdate with progressively longer text.
 */
export function typewriterReveal(text, onUpdate, options = {}) {
  const speed = options.speed || GAME_CONFIG.cinematic.textRevealSpeed;
  const onComplete = options.onComplete || (() => {});

  return new Promise((resolve) => {
    let index = 0;

    const interval = setInterval(() => {
      index++;
      onUpdate(text.substring(0, index));

      if (index >= text.length) {
        clearInterval(interval);
        onComplete();
        resolve();
      }
    }, speed);

    // Return cleanup function via the promise
    return () => clearInterval(interval);
  });
}

/**
 * Sequential element reveal — shows elements one by one.
 */
export function sequentialReveal(elements, onReveal, options = {}) {
  const delay = options.delay || 300;

  return new Promise((resolve) => {
    let index = 0;

    const interval = setInterval(() => {
      if (index >= elements.length) {
        clearInterval(interval);
        resolve();
        return;
      }

      onReveal(elements[index], index);
      index++;
    }, delay);
  });
}

/**
 * Delayed action — cinematic pause.
 */
export function cinematicPause(duration = GAME_CONFIG.cinematic.sceneHoldDuration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

/**
 * Scene transition — fade out, execute, fade in.
 */
export async function sceneTransition(onFadeOut, onFadeIn, options = {}) {
  const duration = options.duration || GAME_CONFIG.cinematic.fadeTransition;

  // Signal fade out
  if (onFadeOut) await onFadeOut();
  await cinematicPause(duration);

  // Signal fade in
  if (onFadeIn) await onFadeIn();
  await cinematicPause(duration / 2);
}

/**
 * Dialogue sequence — plays dialogue lines with pauses.
 */
export async function playDialogueSequence(dialogueLines, onLine, options = {}) {
  const basePause = options.basePause || GAME_CONFIG.cinematic.dialoguePause;

  for (let i = 0; i < dialogueLines.length; i++) {
    const line = dialogueLines[i];
    await onLine(line, i);

    const pause = line.pause !== undefined ? line.pause : basePause;
    if (pause > 0 && i < dialogueLines.length - 1) {
      await cinematicPause(pause);
    }
  }
}

export default {
  typewriterReveal,
  sequentialReveal,
  cinematicPause,
  sceneTransition,
  playDialogueSequence,
};
