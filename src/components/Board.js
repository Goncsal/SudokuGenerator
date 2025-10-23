import React, { useCallback } from 'react';
import Cell from './Cell';
import './Board.css';

const Board = ({ 
  puzzle, 
  userGrid, 
  annotations, 
  selectedCell, 
  errors,
  onCellClick, 
  onCellDoubleClick 
}) => {
  // Determine if a cell should be highlighted (same row, column, or box as selected)
  const isHighlighted = useCallback((row, col) => {
    if (!selectedCell) return false;
    
    const [selectedRow, selectedCol] = selectedCell;
    
    // Same row or column
    if (row === selectedRow || col === selectedCol) return true;
    
    // Same 3x3 box
    const boxRow = Math.floor(row / 3);
    const boxCol = Math.floor(col / 3);
    const selectedBoxRow = Math.floor(selectedRow / 3);
    const selectedBoxCol = Math.floor(selectedCol / 3);
    
    return boxRow === selectedBoxRow && boxCol === selectedBoxCol;
  }, [selectedCell]);

  // Determine if cell is part of thick border (3x3 box boundaries)
  const getCellBorderClasses = (row, col) => {
    const classes = [];
    
    if (row % 3 === 0 && row !== 0) classes.push('border-top-thick');
    if (col % 3 === 0 && col !== 0) classes.push('border-left-thick');
    if (row === 8) classes.push('border-bottom-thick');
    if (col === 8) classes.push('border-right-thick');
    
    return classes.join(' ');
  };

  if (!puzzle || !userGrid) {
    return <div className="board-loading">Loading puzzle...</div>;
  }

  return (
    <div className="board">
      {puzzle.map((row, rowIndex) =>
        row.map((_, colIndex) => {
          const isSelected = selectedCell && 
            selectedCell[0] === rowIndex && 
            selectedCell[1] === colIndex;
          const cellAnnotations = annotations[`${rowIndex}-${colIndex}`] || [];
          const hasError = errors[`${rowIndex}-${colIndex}`] || false;
          const isInitial = puzzle[rowIndex][colIndex] !== 0;
          
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`cell-container ${getCellBorderClasses(rowIndex, colIndex)}`}
            >
              <Cell
                value={userGrid[rowIndex][colIndex]}
                isSelected={isSelected}
                isHighlighted={isHighlighted(rowIndex, colIndex)}
                isInitial={isInitial}
                hasError={hasError}
                annotations={cellAnnotations}
                onClick={onCellClick}
                onDoubleClick={onCellDoubleClick}
                row={rowIndex}
                col={colIndex}
              />
            </div>
          );
        })
      )}
    </div>
  );
};

export default Board;
