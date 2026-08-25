/* ============================================
   LOST IN THE CLOUD — Cloud Operations Terminal
   ============================================ */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGame } from '../../state/GameContext';
import StoryEngine from '../../engine/StoryEngine';
import GAME_CONFIG from '../../data/config';
import '../../styles/terminal.css';

// ---- Command Registry ----
function createCommandRegistry(gameState, gameActions) {
  return {
    help: {
      description: 'List available commands',
      execute: () => ({
        type: 'output',
        lines: [
          'NEXORA CLOUD TERMINAL — AVAILABLE COMMANDS',
          '─────────────────────────────────────────────',
          '  help           Show this help message',
          '  whoami         Display your identity',
          '  system-status  Check production system status',
          '  mission        Show current mission info',
          '  clear          Clear terminal output',
          '  date           Show current date',
          '  uptime         Show system uptime',
          '',
          'More commands unlock as you progress.',
        ],
      }),
    },

    whoami: {
      description: 'Display your identity',
      execute: () => ({
        type: 'output',
        lines: [
          `Employee: ${gameState.name}`,
          `Position: ${gameState.position}`,
          `Department: ${gameState.department}`,
          `Level: ${gameState.level}`,
          `XP: ${gameState.xp}`,
          `Status: ${gameState.status}`,
        ],
      }),
    },

    'system-status': {
      description: 'Check production system status',
      execute: () => {
        // Complete terminal task if required
        const scene = StoryEngine.getCurrentScene(gameState);
        if (scene?.type === 'terminal_task' && scene.requiredCommand === 'system-status') {
          // Complete the objective and advance
          if (scene.objectiveComplete) {
            gameActions.completeObjective(scene.objectiveComplete);
          }
          gameActions.completeScene(scene.id);

          const nextId = StoryEngine.getNextSceneId(gameState);
          if (nextId) {
            setTimeout(() => gameActions.advanceScene(nextId), 1500);
          }
        }

        return {
          type: 'success',
          lines: [
            '',
            'NEXORA PRODUCTION',
            '─────────────────────────────',
            '  WEB        ● ONLINE',
            '  DATABASE   ● ONLINE',
            '  STORAGE    ● ONLINE',
            '  NETWORK    ● ONLINE',
            '  CDN        ● ONLINE',
            '  CACHE      ● ONLINE',
            '',
            'All systems operational.',
            '',
          ],
        };
      },
    },

    mission: {
      description: 'Show current mission',
      execute: () => {
        const mission = StoryEngine.getCurrentMission(gameState);
        if (!mission) {
          return { type: 'warning', lines: ['No active mission.'] };
        }
        const progress = StoryEngine.getMissionProgress(gameState);
        return {
          type: 'output',
          lines: [
            '',
            `MISSION ${mission.number} — ${mission.title}`,
            '─────────────────────────────',
            mission.description,
            `Progress: ${progress}%`,
            '',
          ],
        };
      },
    },

    clear: {
      description: 'Clear terminal',
      execute: () => {
        gameActions.clearTerminal();
        return null; // Don't add output
      },
    },

    date: {
      description: 'Show current date',
      execute: () => ({
        type: 'output',
        lines: [new Date().toLocaleString()],
      }),
    },

    uptime: {
      description: 'Show system uptime',
      execute: () => ({
        type: 'output',
        lines: [
          `Nexora Cloud — Day ${gameState.day}`,
          `Uptime: ${Math.floor(Math.random() * 90 + 10)} days, ${Math.floor(Math.random() * 24)}h`,
          'Last incident: 3 days ago',
        ],
      }),
    },
  };
}

export default function CloudTerminal() {
  const { state, addTerminalEntry, clearTerminal, completeObjective, completeScene, advanceScene } = useGame();
  const [collapsed, setCollapsed] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const outputRef = useRef(null);
  const inputRef = useRef(null);

  const commands = createCommandRegistry(state, {
    clearTerminal,
    completeObjective,
    completeScene,
    advanceScene,
  });

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [state.terminalHistory]);

  // Welcome message
  useEffect(() => {
    if (state.terminalHistory.length === 0) {
      addTerminalEntry({
        type: 'system',
        content: GAME_CONFIG.terminal.welcomeMessage,
      });
      addTerminalEntry({
        type: 'info',
        content: 'Type "help" for available commands.',
      });
    }
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const cmd = inputValue.trim();
    if (!cmd) return;

    // Add command to history
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    setInputValue('');

    // Log command
    addTerminalEntry({ type: 'command', content: cmd });

    // Execute command
    const commandName = cmd.toLowerCase().split(' ')[0];
    const handler = commands[commandName];

    if (handler) {
      const result = handler.execute(cmd);
      if (result) {
        result.lines.forEach(line => {
          addTerminalEntry({ type: result.type || 'output', content: line });
        });
      }
    } else {
      addTerminalEntry({
        type: 'error',
        content: `Command not found: ${commandName}. Type "help" for available commands.`,
      });
    }
  }, [inputValue, commands, addTerminalEntry]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputValue('');
      } else {
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex]);
      }
    }
  };

  const handleTerminalClick = () => {
    if (inputRef.current && !collapsed) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={`cloud-terminal ${collapsed ? 'cloud-terminal--collapsed' : ''}`} onClick={handleTerminalClick}>
      {/* Header */}
      <div className="terminal-header" onClick={(e) => { e.stopPropagation(); setCollapsed(!collapsed); }}>
        <div className="terminal-header__title">
          <span className="terminal-header__dot" />
          CLOUD OPERATIONS TERMINAL
        </div>
        <button className="terminal-header__toggle">
          {collapsed ? '▲ EXPAND' : '▼ COLLAPSE'}
        </button>
      </div>

      {!collapsed && (
        <>
          {/* Output */}
          <div className="terminal-output" ref={outputRef}>
            {state.terminalHistory.map((entry, i) => (
              <div key={i} className={`terminal-line terminal-line--${entry.type}`}>
                <span className="terminal-line__timestamp">{entry.timestamp}</span>
                <span className="terminal-line__content">{entry.content}</span>
              </div>
            ))}
          </div>

          {/* Input */}
          <form className="terminal-input-row" onSubmit={handleSubmit}>
            <span className="terminal-prompt">{GAME_CONFIG.terminal.prompt}</span>
            <input
              ref={inputRef}
              className="terminal-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter command..."
              autoComplete="off"
              spellCheck="false"
            />
          </form>
        </>
      )}
    </div>
  );
}
