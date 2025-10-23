import React, { useState, useEffect, useCallback } from 'react';
import { getIncompleteGames, getAllGames, deleteGame } from '../utils/storage';
import './SavedGames.css';

const SavedGames = ({ isOpen, onClose, onLoadGame }) => {
  const [savedGames, setSavedGames] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadSavedGames = useCallback(async () => {
    setLoading(true);
    try {
      const games = showCompleted ? await getAllGames() : await getIncompleteGames();
      // Sort by timestamp (newest first)
      games.sort((a, b) => b.timestamp - a.timestamp);
      setSavedGames(games);
    } catch (error) {
      console.error('Error loading saved games:', error);
    } finally {
      setLoading(false);
    }
  }, [showCompleted]);

  useEffect(() => {
    if (isOpen) {
      loadSavedGames();
    }
  }, [isOpen, showCompleted, loadSavedGames]);

  const handleLoadGame = (game) => {
    onLoadGame(game.id);
    onClose();
  };

  const handleDeleteGame = async (gameId, event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this game?')) {
      try {
        await deleteGame(gameId);
        loadSavedGames();
      } catch (error) {
        console.error('Error deleting game:', error);
      }
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="saved-games-overlay" onClick={onClose}>
      <div className="saved-games-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>💾 Saved Games</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-controls">
          <div className="toggle-container">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
              />
              Show completed games
            </label>
          </div>
        </div>

        <div className="modal-content">
          {loading ? (
            <div className="loading">Loading saved games...</div>
          ) : savedGames.length === 0 ? (
            <div className="no-games">
              {showCompleted ? 'No completed games yet.' : 'No saved games yet. Start playing to save your progress!'}
            </div>
          ) : (
            <div className="games-list">
              {savedGames.map((game) => (
                <div 
                  key={game.id} 
                  className="game-item"
                  onClick={() => handleLoadGame(game)}
                >
                  <div className="game-info">
                    <div className="game-header">
                      <span className="difficulty">
                        {getDifficultyIcon(game.difficulty)} {game.difficulty}
                      </span>
                      <span className="game-date">{formatDate(game.timestamp)}</span>
                    </div>
                    
                    <div className="game-stats">
                      <span className="time">⏱️ {formatTime(game.elapsedTime)}</span>
                      {game.completed && (
                        <span className="completed">✅ Completed</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="game-actions">
                    <button 
                      className="delete-btn"
                      onClick={(e) => handleDeleteGame(game.id, e)}
                      title="Delete game"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedGames;
