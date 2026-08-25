/* ============================================
   LOST IN THE CLOUD — Game Workspace
   ============================================ */

import React, { useState } from 'react';
import { useGame } from '../state/GameContext';
import Navigation from '../components/common/Navigation';
import LeftPanel from '../components/workspace/LeftPanel';
import CenterPanel from '../components/workspace/CenterPanel';
import RightPanel from '../components/workspace/RightPanel';
import CloudTerminal from '../components/terminal/CloudTerminal';
import './GameWorkspace.css';

export default function GameWorkspace() {
  const { state } = useGame();
  const [activeNav, setActiveNav] = useState('mission');
  const [mobilePanel, setMobilePanel] = useState('center');

  return (
    <div className="game-workspace">
      <Navigation activeItem={activeNav} onNavigate={setActiveNav} />

      <div className="workspace-grid">
        <div className={`left-panel ${mobilePanel === 'left' ? 'mobile-visible' : ''}`}>
          <LeftPanel />
        </div>

        <div className="center-panel">
          <CenterPanel activeView={activeNav} />
        </div>

        <div className={`right-panel ${mobilePanel === 'right' ? 'mobile-visible' : ''}`}>
          <RightPanel />
        </div>

        <div className="terminal-panel">
          <CloudTerminal />
        </div>
      </div>

      {/* Mobile panel switcher */}
      <div className="mobile-tabs">
        <button
          className={`mobile-tab ${mobilePanel === 'left' ? 'mobile-tab--active' : ''}`}
          onClick={() => setMobilePanel('left')}
        >
          MISSION
        </button>
        <button
          className={`mobile-tab ${mobilePanel === 'center' ? 'mobile-tab--active' : ''}`}
          onClick={() => setMobilePanel('center')}
        >
          MAIN
        </button>
        <button
          className={`mobile-tab ${mobilePanel === 'right' ? 'mobile-tab--active' : ''}`}
          onClick={() => setMobilePanel('right')}
        >
          COMMS
        </button>
      </div>
    </div>
  );
}
