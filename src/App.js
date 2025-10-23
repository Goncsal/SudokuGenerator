import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { useSudoku } from './hooks/useSudoku';
import Board from './components/Board';
import NumberPad from './components/NumberPad';
import GameControls from './components/GameControls';
import Statistics from './components/Statistics';
import SavedGames from './components/SavedGames';
import InstallPrompt from './components/InstallPrompt';
import './App.css';

function SudokuGame() {
  const {
    puzzle,
    userGrid,
    annotations,
    selectedCell,
    difficulty,
    isComplete,
    elapsedTime,
    gameState,
    errors,

    newGame,
    makeMove,
    addAnnotation,
    clearCell,
    setSelectedCell,
    undo,
    redo,
    getHintForUser,
    pauseGame,
    resumeGame,
    autoSave,
    saveGame,
    loadGame,
    formatTime,
    canUndo,
    canRedo
  } = useSudoku();

  const [isAnnotationMode, setIsAnnotationMode] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showSavedGames, setShowSavedGames] = useState(false);
  const [currentAnnotations, setCurrentAnnotations] = useState([]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (puzzle && !isComplete) {
        autoSave();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [puzzle, isComplete, autoSave]);

  // Start with a new game on load
  useEffect(() => {
    newGame('medium');
  }, [newGame]);

  const handleAnnotationToggle = useCallback((number) => {
    if (!selectedCell) return;
    
    const [row, col] = selectedCell;
    const newAnnotations = currentAnnotations.includes(number)
      ? currentAnnotations.filter(n => n !== number)
      : [...currentAnnotations, number].sort();
    
    setCurrentAnnotations(newAnnotations);
    addAnnotation(row, col, newAnnotations);
  }, [selectedCell, currentAnnotations, addAnnotation]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!selectedCell || isComplete) return;

      const [row, col] = selectedCell;
      
      // Number keys 1-9
      if (event.key >= '1' && event.key <= '9') {
        const number = parseInt(event.key);
        if (isAnnotationMode) {
          handleAnnotationToggle(number);
        } else {
          makeMove(row, col, number);
        }
      }
      
      // Delete/Backspace to clear
      if (event.key === 'Delete' || event.key === 'Backspace') {
        clearCell(row, col);
      }
      
      // Arrow keys for navigation
      if (event.key.startsWith('Arrow')) {
        event.preventDefault();
        let newRow = row;
        let newCol = col;
        
        switch (event.key) {
          case 'ArrowUp': newRow = Math.max(0, row - 1); break;
          case 'ArrowDown': newRow = Math.min(8, row + 1); break;
          case 'ArrowLeft': newCol = Math.max(0, col - 1); break;
          case 'ArrowRight': newCol = Math.min(8, col + 1); break;
          default: break;
        }
        
        setSelectedCell([newRow, newCol]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedCell, isAnnotationMode, isComplete, makeMove, clearCell, setSelectedCell, handleAnnotationToggle]);

  const handleCellClick = (row, col) => {
    setSelectedCell([row, col]);
    if (isAnnotationMode) {
      const key = `${row}-${col}`;
      setCurrentAnnotations(annotations[key] || []);
    }
  };

  const handleCellDoubleClick = (row, col) => {
    if (puzzle && puzzle[row][col] === 0) {
      clearCell(row, col);
    }
  };

  const handleNumberClick = (number) => {
    if (!selectedCell) return;
    
    const [row, col] = selectedCell;
    
    if (isAnnotationMode) {
      handleAnnotationToggle(number);
    } else {
      makeMove(row, col, number);
    }
  };

  const handleClearCell = () => {
    if (!selectedCell) return;
    
    const [row, col] = selectedCell;
    clearCell(row, col);
    setCurrentAnnotations([]);
  };

  const handleHint = () => {
    const hint = getHintForUser();
    if (hint) {
      makeMove(hint.row, hint.col, hint.value);
      setSelectedCell([hint.row, hint.col]);
    }
  };

  const handleSave = async () => {
    const savedId = await saveGame();
    if (savedId) {
      alert('Game saved successfully!');
    } else {
      alert('Failed to save game. Please try again.');
    }
  };

  const handleLoadGame = async (gameId) => {
    await loadGame(gameId);
    setShowSavedGames(false); // Close the saved games modal
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🧩 Sudoku PWA</h1>
        <div className="header-actions">
          <button 
            className="header-btn"
            onClick={() => setShowSavedGames(true)}
            title="Saved Games"
          >
            💾
          </button>
          <button 
            className="header-btn"
            onClick={() => setShowStatistics(true)}
            title="Statistics"
          >
            📊
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="game-container">
          <GameControls
            difficulty={difficulty}
            onNewGame={newGame}
            onUndo={undo}
            onRedo={redo}
            onHint={handleHint}
            onPause={pauseGame}
            onResume={resumeGame}
            canUndo={canUndo}
            canRedo={canRedo}
            gameState={gameState}
            elapsedTime={elapsedTime}
            formatTime={formatTime}
            onSave={handleSave}
            isComplete={isComplete}
          />

          <div className="board-container">
            <Board
              puzzle={puzzle}
              userGrid={userGrid}
              annotations={annotations}
              selectedCell={selectedCell}
              errors={errors}
              onCellClick={handleCellClick}
              onCellDoubleClick={handleCellDoubleClick}
            />
          </div>

          <NumberPad
            onNumberClick={handleNumberClick}
            onClear={handleClearCell}
            onAnnotationToggle={() => setIsAnnotationMode(!isAnnotationMode)}
            isAnnotationMode={isAnnotationMode}
          />
        </div>
      </main>

      <Statistics 
        isOpen={showStatistics}
        onClose={() => setShowStatistics(false)}
      />

      <SavedGames
        isOpen={showSavedGames}
        onClose={() => setShowSavedGames(false)}
        onLoadGame={handleLoadGame}
      />

      {isComplete && (
        <div className="completion-overlay">
          <div className="completion-message">
            <h2>🎉 Congratulations!</h2>
            <p>You completed the {difficulty} puzzle in {formatTime(elapsedTime)}!</p>
            <button 
              className="new-game-btn"
              onClick={() => newGame(difficulty)}
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      <InstallPrompt />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <SudokuGame />
    </ThemeProvider>
  );
}

export default App;
