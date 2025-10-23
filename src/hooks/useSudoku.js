import { useState, useEffect, useCallback } from 'react';
import { generatePuzzle, isValidMove, isPuzzleComplete, getHint, cloneGrid } from '../utils/sudoku';
import * as storage from '../utils/storage';

export const useSudoku = (initialGameId = null) => {
  const [currentGameId, setCurrentGameId] = useState(initialGameId);
  const [puzzle, setPuzzle] = useState(null);
  const [solution, setSolution] = useState(null);
  const [userGrid, setUserGrid] = useState(null);
  const [annotations, setAnnotations] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'paused', 'complete'
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [errors, setErrors] = useState({});

  // Define loadGame function first
  const loadGame = useCallback(async (id) => {
    try {
      const game = await storage.getGame(id);
      if (game) {
        setCurrentGameId(id); // Set the current game ID
        setPuzzle(game.puzzle);
        setSolution(game.solution);
        setUserGrid(game.userGrid);
        setAnnotations(game.annotations || {});
        setDifficulty(game.difficulty);
        setStartTime(game.startTime);
        setElapsedTime(game.elapsedTime || 0);
        setIsComplete(game.completed || false);
        setGameState(game.gameState || 'playing');
        setHistory(game.history || []);
        setHistoryIndex(game.historyIndex || -1);
      }
    } catch (error) {
      console.error('Error loading game:', error);
    }
  }, []);

  // Load existing game if gameId provided
  useEffect(() => {
    if (initialGameId) {
      loadGame(initialGameId);
    }
  }, [initialGameId, loadGame]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (gameState === 'playing' && startTime && !isComplete) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, startTime, isComplete]);

    const saveGame = useCallback(async () => {
    if (!puzzle || !userGrid) return null;
    
    const gameData = {
      id: currentGameId,
      puzzle,
      solution,
      userGrid,
      annotations,
      difficulty,
      startTime,
      elapsedTime,
      gameState,
      completed: isComplete,
      savedAt: Date.now()
    };
    
    try {
      const savedId = await storage.saveGame(gameData);
      console.log('Game saved with ID:', savedId);
      setCurrentGameId(savedId); // Update the current game ID
      return savedId;
    } catch (error) {
      console.error('Error saving game:', error);
      return null;
    }
  }, [currentGameId, puzzle, solution, userGrid, annotations, difficulty, startTime, elapsedTime, gameState, isComplete]);

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (!puzzle || !userGrid) return null;
    
    const gameData = {
      id: currentGameId,
      puzzle,
      solution,
      userGrid,
      annotations,
      difficulty,
      startTime,
      elapsedTime,
      gameState,
      completed: isComplete,
      savedAt: Date.now()
    };
    
    try {
      const savedId = await storage.saveGame(gameData);
      console.log('Game auto-saved with ID:', savedId);
      if (!currentGameId) {
        setCurrentGameId(savedId); // Set ID for new games
      }
      return savedId;
    } catch (error) {
      console.error('Error auto-saving game:', error);
      return null;
    }
  }, [currentGameId, puzzle, solution, userGrid, annotations, difficulty, startTime, elapsedTime, gameState, isComplete]);

  // Check completion when grid changes
  useEffect(() => {
    if (userGrid && isPuzzleComplete(userGrid)) {
      setIsComplete(true);
      setGameState('complete');
      autoSave();
    }
  }, [userGrid, autoSave]);

  const newGame = useCallback((newDifficulty = 'medium') => {
    const { puzzle: newPuzzle, solution: newSolution } = generatePuzzle(newDifficulty);
    
    setPuzzle(newPuzzle);
    setSolution(newSolution);
    setUserGrid(cloneGrid(newPuzzle));
    setAnnotations({});
    setSelectedCell(null);
    setDifficulty(newDifficulty);
    setIsComplete(false);
    setStartTime(Date.now());
    setElapsedTime(0);
    setGameState('playing');
    setHistory([]);
    setHistoryIndex(-1);
    setErrors({});
    setCurrentGameId(null); // Reset game ID for new puzzle
  }, []);

  const makeMove = useCallback((row, col, value) => {
    if (!userGrid || puzzle[row][col] !== 0) return false;

    const newGrid = cloneGrid(userGrid);
    const oldValue = newGrid[row][col];
    newGrid[row][col] = value;

    // Validate move
    const isValid = value === 0 || isValidMove(newGrid, row, col, value);
    
    // Update errors
    const errorKey = `${row}-${col}`;
    const newErrors = { ...errors };
    if (!isValid && value !== 0) {
      newErrors[errorKey] = true;
    } else {
      delete newErrors[errorKey];
    }
    setErrors(newErrors);

    // Add to history for undo/redo
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      row,
      col,
      oldValue,
      newValue: value,
      timestamp: Date.now()
    });

    setUserGrid(newGrid);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    // Clear annotations for this cell if number is placed
    if (value !== 0) {
      const newAnnotations = { ...annotations };
      delete newAnnotations[`${row}-${col}`];
      setAnnotations(newAnnotations);
    }

    return true;
  }, [userGrid, puzzle, history, historyIndex, errors, annotations]);

  const addAnnotation = useCallback((row, col, numbers) => {
    if (!userGrid || puzzle[row][col] !== 0 || userGrid[row][col] !== 0) return;

    const key = `${row}-${col}`;
    const newAnnotations = { ...annotations };
    newAnnotations[key] = numbers;
    setAnnotations(newAnnotations);
  }, [userGrid, puzzle, annotations]);

  const clearCell = useCallback((row, col) => {
    makeMove(row, col, 0);
    const key = `${row}-${col}`;
    const newAnnotations = { ...annotations };
    delete newAnnotations[key];
    setAnnotations(newAnnotations);
  }, [makeMove, annotations]);

  const undo = useCallback(() => {
    if (historyIndex >= 0) {
      const move = history[historyIndex];
      const newGrid = cloneGrid(userGrid);
      newGrid[move.row][move.col] = move.oldValue;
      
      setUserGrid(newGrid);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex, userGrid]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const move = history[nextIndex];
      const newGrid = cloneGrid(userGrid);
      newGrid[move.row][move.col] = move.newValue;
      
      setUserGrid(newGrid);
      setHistoryIndex(nextIndex);
    }
  }, [history, historyIndex, userGrid]);

  const getHintForUser = useCallback(() => {
    if (!puzzle || !solution) return null;
    return getHint(userGrid, solution);
  }, [puzzle, solution, userGrid]);

  const pauseGame = useCallback(() => {
    setGameState('paused');
  }, []);

  const resumeGame = useCallback(() => {
    setGameState('playing');
  }, []);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    // Game state
    puzzle,
    userGrid,
    annotations,
    selectedCell,
    difficulty,
    isComplete,
    elapsedTime,
    gameState,
    errors,
    currentGameId,
    
    // Actions
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
    
    // Utilities
    formatTime,
    canUndo: historyIndex >= 0,
    canRedo: historyIndex < history.length - 1
  };
};
