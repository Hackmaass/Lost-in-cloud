/* ============================================
   LOST IN THE CLOUD — Opening Cinematic
   ============================================ */

import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../state/GameContext';
import { GAME_PHASES } from '../state/playerReducer';
import { getCharacter } from '../data/characters';
import './CinematicIntro.css';

const CINEMATIC_CARDS = [
  { lines: ['NEXORA SYSTEMS', 'INTERNAL NETWORK'], duration: 2800 },
  { lines: ['MONDAY', '08:47 AM'], duration: 2200 },
  { lines: ['INFRASTRUCTURE ENGINEERING'], duration: 2000 },
  { lines: ['NEW EMPLOYEE'], duration: 1800 },
  { lines: ['JUNIOR CLOUD ENGINEER'], duration: 2200 },
];

const MAYA_DIALOGUE = [
  { text: 'Morning.', pause: 1200 },
  { text: "I'm Maya. I run Infrastructure.", pause: 1000 },
  { text: 'You made it.', pause: 800 },
  { text: 'Good.', pause: 1200 },
  { text: "Because we're going to need you.", pause: 2000 },
];

export default function CinematicIntro() {
  const { setGamePhase, state } = useGame();
  const [phase, setPhase] = useState('cards'); // 'cards' | 'dialogue' | 'done'
  const [currentCard, setCurrentCard] = useState(-1);
  const [cardVisible, setCardVisible] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(-1);
  const [dialogueText, setDialogueText] = useState('');
  const [showSkip, setShowSkip] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const maya = getCharacter('maya');

  // Show skip button after delay
  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 3000);
    return () => clearTimeout(t);
  }, []);

  // Card sequence
  useEffect(() => {
    if (phase !== 'cards') return;

    const nextCard = currentCard + 1;

    if (nextCard >= CINEMATIC_CARDS.length) {
      // Transition to dialogue
      setTimeout(() => setPhase('dialogue'), 800);
      return;
    }

    // Fade in next card
    const showTimer = setTimeout(() => {
      setCurrentCard(nextCard);
      setCardVisible(true);
    }, currentCard === -1 ? 500 : 200);

    // Fade out current card
    const hideTimer = setTimeout(() => {
      setCardVisible(false);
    }, (currentCard === -1 ? 500 : 200) + CINEMATIC_CARDS[nextCard]?.duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [phase, currentCard, cardVisible]);

  // Trigger next card after fade out
  useEffect(() => {
    if (phase !== 'cards') return;
    if (currentCard < 0) return;
    if (cardVisible) return;

    const t = setTimeout(() => {
      setCurrentCard(prev => prev); // trigger re-render for useEffect above
      // Force next card
      const nextCard = currentCard + 1;
      if (nextCard >= CINEMATIC_CARDS.length) {
        setTimeout(() => setPhase('dialogue'), 600);
      } else {
        setTimeout(() => {
          setCurrentCard(nextCard);
          setCardVisible(true);
          // Schedule hide
          setTimeout(() => setCardVisible(false), CINEMATIC_CARDS[nextCard].duration);
        }, 400);
      }
    }, 400);

    return () => clearTimeout(t);
  }, [cardVisible]);

  // Dialogue sequence
  useEffect(() => {
    if (phase !== 'dialogue') return;

    if (dialogueIndex === -1) {
      setTimeout(() => setDialogueIndex(0), 600);
      return;
    }

    if (dialogueIndex >= MAYA_DIALOGUE.length) {
      setTimeout(() => setPhase('done'), 1500);
      return;
    }

    // Typewriter effect
    const line = MAYA_DIALOGUE[dialogueIndex];
    let charIndex = 0;
    setIsTyping(true);
    setDialogueText('');

    const typeInterval = setInterval(() => {
      charIndex++;
      setDialogueText(line.text.substring(0, charIndex));

      if (charIndex >= line.text.length) {
        clearInterval(typeInterval);
        setIsTyping(false);

        // Wait then advance
        setTimeout(() => {
          setDialogueIndex(prev => prev + 1);
        }, line.pause);
      }
    }, 35);

    return () => clearInterval(typeInterval);
  }, [phase, dialogueIndex]);

  // Auto-advance to gameplay when done
  useEffect(() => {
    if (phase === 'done') {
      setTimeout(() => {
        setGamePhase(GAME_PHASES.GAMEPLAY);
      }, 1000);
    }
  }, [phase, setGamePhase]);

  const handleSkip = () => {
    setGamePhase(GAME_PHASES.GAMEPLAY);
  };

  return (
    <div className="cinematic">
      {/* Cards Phase */}
      {phase === 'cards' && currentCard >= 0 && currentCard < CINEMATIC_CARDS.length && (
        <div className={`cinematic__card ${cardVisible ? 'cinematic__card--visible' : ''}`}>
          {CINEMATIC_CARDS[currentCard].lines.map((line, i) => (
            <div
              key={i}
              className={`cinematic__card-line ${i === 0 ? 'cinematic__card-line--primary' : 'cinematic__card-line--secondary'}`}
            >
              {line}
            </div>
          ))}
        </div>
      )}

      {/* Dialogue Phase */}
      {phase === 'dialogue' && dialogueIndex >= 0 && (
        <div className="cinematic__dialogue anim-fade-in">
          <div className="cinematic__dialogue-speaker" style={{ color: maya.accentColor }}>
            MAYA
          </div>
          <div className="cinematic__dialogue-text">
            "{dialogueText}"
            {isTyping && <span className="cinematic__cursor">|</span>}
          </div>
        </div>
      )}

      {/* Done — fade out */}
      {phase === 'done' && (
        <div className="cinematic__fade-out" />
      )}

      {/* Skip */}
      {showSkip && phase !== 'done' && (
        <button className="cinematic__skip" onClick={handleSkip}>
          SKIP →
        </button>
      )}
    </div>
  );
}
