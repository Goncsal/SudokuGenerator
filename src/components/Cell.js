import React from 'react';
import './Cell.css';

const Cell = ({ 
  value, 
  isSelected, 
  isHighlighted, 
  isInitial, 
  hasError,
  annotations,
  onClick,
  onDoubleClick,
  row,
  col 
}) => {
  const cellClasses = [
    'cell',
    isSelected && 'selected',
    isHighlighted && 'highlighted',
    isInitial && 'initial',
    hasError && 'error',
    value === 0 && 'empty'
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    onClick(row, col);
  };

  const handleDoubleClick = () => {
    onDoubleClick(row, col);
  };

  return (
    <div 
      className={cellClasses}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {value !== 0 ? (
        <span className="cell-value">{value}</span>
      ) : annotations && annotations.length > 0 ? (
        <div className="annotations">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <span 
              key={num} 
              className={`annotation ${annotations.includes(num) ? 'active' : ''}`}
            >
              {annotations.includes(num) ? num : ''}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Cell;
