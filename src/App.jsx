/* ============================================
   LOST IN THE CLOUD — App Root
   Routing via game phase state
   ============================================ */

import React from 'react';
import { GameProvider, useGame } from './state/GameContext';
import { GAME_PHASES } from './state/playerReducer';
import LandingPage from './pages/LandingPage';
import PlayerCreation from './pages/PlayerCreation';
import CinematicIntro from './pages/CinematicIntro';
import GameWorkspace from './pages/GameWorkspace';

import './styles/index.css';
import './styles/typography.css';
import './styles/animations.css';

function GameRouter() {
  const { state } = useGame();

  switch (state.gamePhase) {
    case GAME_PHASES.LANDING:
      return <LandingPage />;
    case GAME_PHASES.PLAYER_CREATION:
      return <PlayerCreation />;
    case GAME_PHASES.CINEMATIC_INTRO:
      return <CinematicIntro />;
    case GAME_PHASES.GAMEPLAY:
      return <GameWorkspace />;
    default:
      return <LandingPage />;
  }
}

function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}

export default App;
