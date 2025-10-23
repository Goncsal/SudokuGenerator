import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './GameControls.css';

const GameControls = ({
  difficulty,
  onNewGame,
  onUndo,
  onRedo,
  onHint,
  onPause,
  onResume,
  canUndo,
  canRedo,
  gameState,
  elapsedTime,
  formatTime,
  onSave,
  isComplete
}) => {
  const { theme, toggleTheme } = useTheme();

  const handleDifficultyChange = (newDifficulty) => {
    if (window.confirm('Start a new game with this difficulty?')) {
      onNewGame(newDifficulty);
    }
  };

  return (
    <div className="game-controls">
      <div className="controls-row">
        <div className="timer">
          ⏱️ {formatTime(elapsedTime)}
        </div>
        
        <div className="game-status">
          {isComplete ? (
            <span className="status-complete">🎉 Complete!</span>
          ) : (
            <span className="status-playing">
              {gameState === 'paused' ? '⏸️ Paused' : '▶️ Playing'}
            </span>
          )}
        </div>
      </div>

      <div className="controls-row">
        <div className="difficulty-selector">
          <label>Difficulty:</label>
          <div className="difficulty-buttons">
            {['easy', 'medium', 'hard'].map(level => (
              <button
                key={level}
                className={`difficulty-btn ${difficulty === level ? 'active' : ''}`}
                onClick={() => handleDifficultyChange(level)}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="controls-row">
        <div className="action-buttons">
          <button 
            className="control-btn new-game"
            onClick={() => onNewGame(difficulty)}
            title="New Game"
          >
            🆕 New
          </button>
          
          <button 
            className="control-btn"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo"
          >
            ↶ Undo
          </button>
          
          <button 
            className="control-btn"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo"
          >
            ↷ Redo
          </button>
          
          <button 
            className="control-btn hint"
            onClick={onHint}
            disabled={isComplete}
            title="Get Hint"
          >
            💡 Hint
          </button>
        </div>
      </div>

      <div className="controls-row">
        <div className="secondary-buttons">
          <button 
            className="control-btn"
            onClick={gameState === 'paused' ? onResume : onPause}
            disabled={isComplete}
            title={gameState === 'paused' ? 'Resume' : 'Pause'}
          >
            {gameState === 'paused' ? '▶️ Resume' : '⏸️ Pause'}
          </button>
          
          <button 
            className="control-btn save"
            onClick={onSave}
            title="Save Game"
          >
            💾 Save
          </button>
          
          <button 
            className="control-btn theme"
            onClick={toggleTheme}
            title="Toggle Theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
