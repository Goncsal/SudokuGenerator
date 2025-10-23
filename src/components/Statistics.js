import React, { useState, useEffect } from 'react';
import { getGameStats } from '../utils/storage';
import './Statistics.css';

const Statistics = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const gameStats = await getGameStats();
      setStats(gameStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="statistics-overlay" onClick={onClose}>
      <div className="statistics-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📊 Statistics</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          {loading ? (
            <div className="loading">Loading statistics...</div>
          ) : stats ? (
            <div className="stats-content">
              <div className="stats-overview">
                <div className="stat-card">
                  <div className="stat-value">{stats.totalGames}</div>
                  <div className="stat-label">Games Played</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-value">{stats.completedGames}</div>
                  <div className="stat-label">Completed</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-value">{stats.completionRate.toFixed(1)}%</div>
                  <div className="stat-label">Completion Rate</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-value">{formatTime(Math.floor(stats.averageTime))}</div>
                  <div className="stat-label">Avg. Time</div>
                </div>
              </div>

              <div className="difficulty-stats">
                <h3>By Difficulty</h3>
                {Object.entries(stats.byDifficulty).map(([difficulty, data]) => (
                  <div key={difficulty} className="difficulty-row">
                    <div className="difficulty-name">
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </div>
                    <div className="difficulty-data">
                      <span>{data.completed}/{data.total}</span>
                      <span className="completion-rate">
                        {data.total > 0 ? `(${((data.completed / data.total) * 100).toFixed(1)}%)` : '(0%)'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-stats">No statistics available yet. Play some games to see your stats!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
