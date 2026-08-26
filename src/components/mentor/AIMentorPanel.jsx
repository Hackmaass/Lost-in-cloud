/* ============================================
   LOST IN THE CLOUD — AI Mentor & Hints Panel
   ============================================ */

import React, { useState } from 'react';
import { useGame } from '../../state/GameContext';
import MentorEngine, { CONCEPT_EXPLANATIONS } from '../../engine/MentorEngine';
import './AIMentorPanel.css';

export default function AIMentorPanel() {
  const { state } = useGame();
  const [hintLevel, setHintLevel] = useState(1);
  const [selectedConcept, setSelectedConcept] = useState('EC2');
  const [messages, setMessages] = useState([
    {
      sender: 'arjun',
      text: "Need a hand? Don't just ask me for the solution — tell me what you've noticed in the architecture.",
      time: 'Just now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');

  const currentHint = MentorEngine.getHint(state.currentMission, hintLevel);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setInputVal('');

    const newMsgs = [...messages, { sender: 'player', text: userText, time: 'Just now' }];
    setMessages(newMsgs);

    // Mentor response logic
    setTimeout(() => {
      let reply = "Look closely at the metrics and the audit log. What changed at 03:17 AM?";
      const lower = userText.toLowerCase();

      if (lower.includes('ec2') || lower.includes('instance') || lower.includes('server')) {
        reply = "EC2 instances can be running, stopped, or rebooting. If an instance is stopped, traffic won't reach it. Run 'ec2 list' or inspect it on the Arch Map.";
      } else if (lower.includes('s3') || lower.includes('disk') || lower.includes('storage') || lower.includes('upload')) {
        reply = "Storing application uploads directly on EBS will saturate your root volume. Offload them to an S3 bucket with 's3 sync'.";
      } else if (lower.includes('iam') || lower.includes('permission') || lower.includes('elias') || lower.includes('policy')) {
        reply = "Legacy accounts with AdministratorAccess are dangerous. Check 'iam list-users' and revoke excessive policies.";
      } else if (lower.includes('sg') || lower.includes('security') || lower.includes('ssh') || lower.includes('port')) {
        reply = "Security Groups are stateful firewalls. Opening port 22 to 0.0.0.0/0 exposes SSH to the entire internet.";
      } else if (lower.includes('rds') || lower.includes('database') || lower.includes('latency')) {
        reply = "Check your connection counts on the RDS instance. High latency often points to rogue external connection pools.";
      } else if (lower.includes('hint') || lower.includes('help') || lower.includes('stuck')) {
        reply = `Here is a Level ${hintLevel} pointer: ${currentHint.text}`;
      }

      setMessages(prev => [...prev, { sender: 'arjun', text: reply, time: 'Just now' }]);
    }, 600);
  };

  return (
    <div className="mentor-panel">
      {/* Top Header */}
      <div className="mentor-panel__header">
        <div>
          <span className="mentor-panel__tag">ENGINEERING GUIDANCE</span>
          <h1 className="mentor-panel__title">AI MENTOR & CLOUD ADVISOR</h1>
        </div>
        <div className="mentor-panel__persona">
          <span className="mentor-panel__persona-dot" />
          <span>MENTOR: ARJUN MEHTA (ONLINE)</span>
        </div>
      </div>

      <div className="mentor-panel__grid">
        {/* Left Column: Progressive Hint System */}
        <div className="mentor-card">
          <div className="mentor-card__header">
            <span className="mentor-card__title">3-TIER PROGRESSIVE HINTS</span>
            <span className="mentor-card__sub">{currentHint.title}</span>
          </div>

          <div className="mentor-hint-stepper">
            <button
              className={`mentor-hint-step ${hintLevel >= 1 ? 'mentor-hint-step--active' : ''}`}
              onClick={() => setHintLevel(1)}
            >
              1. GUIDING QUESTION
            </button>
            <button
              className={`mentor-hint-step ${hintLevel >= 2 ? 'mentor-hint-step--active' : ''}`}
              onClick={() => setHintLevel(2)}
            >
              2. SYSTEM POINTER
            </button>
            <button
              className={`mentor-hint-step ${hintLevel >= 3 ? 'mentor-hint-step--active' : ''}`}
              onClick={() => setHintLevel(3)}
            >
              3. DIRECT REMEDIATION
            </button>
          </div>

          <div className="mentor-hint-box anim-fade-in">
            <div className="mentor-hint-level-tag">LEVEL {hintLevel} HINT:</div>
            <p className="mentor-hint-text">"{currentHint.text}"</p>
          </div>

          <div className="mentor-hint-controls">
            {hintLevel < 3 && (
              <button className="mentor-hint-next-btn" onClick={() => setHintLevel(prev => Math.min(3, prev + 1))}>
                UNLOCK NEXT LEVEL HINT ▸
              </button>
            )}
            {hintLevel > 1 && (
              <button className="mentor-hint-prev-btn" onClick={() => setHintLevel(prev => Math.max(1, prev - 1))}>
                ◂ PREVIOUS HINT
              </button>
            )}
          </div>
        </div>

        {/* Right Column: AWS Knowledge Query Card */}
        <div className="mentor-card">
          <div className="mentor-card__header">
            <span className="mentor-card__title">AWS CONCEPT REFERENCE</span>
            <span className="mentor-card__sub">Architecture Glossary</span>
          </div>

          <div className="mentor-concept-selector">
            {Object.keys(CONCEPT_EXPLANATIONS).map(concept => (
              <button
                key={concept}
                className={`mentor-concept-pill ${selectedConcept === concept ? 'mentor-concept-pill--active' : ''}`}
                onClick={() => setSelectedConcept(concept)}
              >
                {concept}
              </button>
            ))}
          </div>

          <div className="mentor-concept-card anim-fade-in">
            <h3 className="mentor-concept-title">{selectedConcept}</h3>
            <p className="mentor-concept-body">{CONCEPT_EXPLANATIONS[selectedConcept]}</p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Mentor Interactive Chat */}
      <div className="mentor-card mentor-card--chat">
        <div className="mentor-card__header">
          <span className="mentor-card__title">ASK YOUR TECHNICAL MENTOR</span>
          <span className="mentor-card__sub">Type questions about errors, services, or architecture</span>
        </div>

        <div className="mentor-chat-messages">
          {messages.map((m, idx) => (
            <div key={idx} className={`mentor-chat-bubble bubble--${m.sender}`}>
              <div className="mentor-chat-sender">{m.sender === 'arjun' ? 'ARJUN MEHTA' : 'YOU'}</div>
              <div className="mentor-chat-text">{m.text}</div>
            </div>
          ))}
        </div>

        <form className="mentor-chat-input-row" onSubmit={handleSendMessage}>
          <input
            type="text"
            className="mentor-chat-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask Arjun a question (e.g. 'Why is the instance stopped?', 'How do I fix the S3 disk issue?')..."
          />
          <button type="submit" className="mentor-chat-send-btn">SEND ▸</button>
        </form>
      </div>
    </div>
  );
}
