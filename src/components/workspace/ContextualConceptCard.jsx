/* ============================================
   LOST IN THE CLOUD — Contextual Concept Card
   Minimalist, non-intrusive technical concept toast
   triggered when a player discovers an AWS primitive.
   ============================================ */

import React, { useEffect, useState } from 'react';
import './ContextualConceptCard.css';

export default function ContextualConceptCard({ concept, title, description, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`concept-toast ${visible ? 'concept-toast--visible' : ''}`}>
      <div className="concept-toast__header">
        <span className="concept-toast__badge">NEW CONCEPT</span>
        <span className="concept-toast__tag">{concept}</span>
        <button className="concept-toast__close" onClick={handleClose} aria-label="Close">✕</button>
      </div>
      <div className="concept-toast__body">
        <h4 className="concept-toast__title">{title || concept}</h4>
        <p className="concept-toast__description">{description}</p>
      </div>
      <div className="concept-toast__footer">
        <span className="concept-toast__hint">Discovered during investigation</span>
        <button className="concept-toast__action" onClick={handleClose}>Got it</button>
      </div>
    </div>
  );
}
