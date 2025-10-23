// Sudoku utility functions

// Create empty 9x9 grid
export const createEmptyGrid = () => {
  return Array(9).fill().map(() => Array(9).fill(0));
};

// Check if number is valid in given position
export const isValidMove = (grid, row, col, num) => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
};

// Solve sudoku using backtracking
export const solveSudoku = (grid) => {
  const newGrid = grid.map(row => [...row]);
  
  const solve = (grid) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidMove(grid, row, col, num)) {
              grid[row][col] = num;
              if (solve(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  if (solve(newGrid)) {
    return newGrid;
  }
  return null;
};

// Generate a complete valid Sudoku grid (fast version)
export const generateCompleteGrid = () => {
  // Use a template-based approach for speed
  const baseGrid = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [4, 5, 6, 7, 8, 9, 1, 2, 3],
    [7, 8, 9, 1, 2, 3, 4, 5, 6],
    [2, 3, 4, 5, 6, 7, 8, 9, 1],
    [5, 6, 7, 8, 9, 1, 2, 3, 4],
    [8, 9, 1, 2, 3, 4, 5, 6, 7],
    [3, 4, 5, 6, 7, 8, 9, 1, 2],
    [6, 7, 8, 9, 1, 2, 3, 4, 5],
    [9, 1, 2, 3, 4, 5, 6, 7, 8]
  ];
  
  const grid = baseGrid.map(row => [...row]);
  
  // Apply random transformations
  // Random number relabeling
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  
  // Apply the number mapping
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      grid[row][col] = numbers[grid[row][col] - 1];
    }
  }
  
  return grid;
};



// Remove numbers to create puzzle (simplified for better performance)
export const generatePuzzle = (difficulty = 'medium') => {
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      const completeGrid = generateCompleteGrid();
      const puzzleGrid = completeGrid.map(row => [...row]);
      
      const cellsToRemove = {
        easy: 35,    // Reduced for faster generation
        medium: 45,  // Reduced for faster generation  
        hard: 55     // Reduced for faster generation
      };

      const removeCells = cellsToRemove[difficulty] || 45;
      const cellsToTry = [];
      
      // Create list of all cells
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          cellsToTry.push([row, col]);
        }
      }
      
      // Shuffle the cells
      for (let i = cellsToTry.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cellsToTry[i], cellsToTry[j]] = [cellsToTry[j], cellsToTry[i]];
      }
      
      let removed = 0;
      
      // Remove cells in random order
      for (const [row, col] of cellsToTry) {
        if (removed >= removeCells) break;
        
        puzzleGrid[row][col] = 0;
        removed++;
      }
      
      return {
        puzzle: puzzleGrid,
        solution: completeGrid,
        difficulty
      };
      
    } catch (error) {
      attempts++;
      console.log(`Puzzle generation attempt ${attempts} failed, retrying...`);
    }
  }
  
  // Fallback: return a simpler puzzle if generation fails
  console.log('Using fallback puzzle generation');
  return generateFallbackPuzzle(difficulty);
};

// Fallback puzzle generator
const generateFallbackPuzzle = (difficulty) => {
  // Use a pre-made valid puzzle as fallback
  const basePuzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ];
  
  const baseSolution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
  ];
  
  // Apply some transformations to make it different
  const puzzle = basePuzzle.map(row => [...row]);
  const solution = baseSolution.map(row => [...row]);
  
  // Random number relabeling
  const mapping = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = mapping.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mapping[i], mapping[j]] = [mapping[j], mapping[i]];
  }
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = mapping[puzzle[row][col] - 1];
      }
      solution[row][col] = mapping[solution[row][col] - 1];
    }
  }
  
  // Adjust difficulty by removing/adding more numbers
  const cellsToRemove = {
    easy: 5,
    medium: 10,
    hard: 15
  };
  
  const additionalRemoval = cellsToRemove[difficulty] || 10;
  let removed = 0;
  
  while (removed < additionalRemoval) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      removed++;
    }
  }
  
  return {
    puzzle,
    solution,
    difficulty
  };
};



// Check if puzzle is complete
export const isPuzzleComplete = (grid) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) return false;
    }
  }
  return isPuzzleValid(grid);
};

// Check if current state is valid (no conflicts)
export const isPuzzleValid = (grid) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const num = grid[row][col];
      if (num !== 0) {
        // Temporarily remove the number to check validity
        grid[row][col] = 0;
        const valid = isValidMove(grid, row, col, num);
        grid[row][col] = num;
        if (!valid) return false;
      }
    }
  }
  return true;
};

// Get hint (find next logical move)
export const getHint = (puzzleGrid, solutionGrid) => {
  const emptyCells = [];
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (puzzleGrid[row][col] === 0) {
        emptyCells.push({ row, col, value: solutionGrid[row][col] });
      }
    }
  }
  
  if (emptyCells.length === 0) return null;
  
  // Return random empty cell with its solution
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

// Deep clone grid
export const cloneGrid = (grid) => {
  return grid.map(row => [...row]);
};
