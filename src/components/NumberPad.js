import React from 'react';
import './NumberPad.css';

const NumberPad = ({ onNumberClick, onClear, onAnnotationToggle, isAnnotationMode }) => {
  return (
    <div className="number-pad">
      <div className="number-pad-header">
        <button 
          className={`annotation-toggle ${isAnnotationMode ? 'active' : ''}`}
          onClick={onAnnotationToggle}
          title="Toggle annotation mode"
        >
          📝 {isAnnotationMode ? 'Notes ON' : 'Notes OFF'}
        </button>
      </div>
      
      <div className="numbers-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
          <button
            key={number}
            className="number-button"
            onClick={() => onNumberClick(number)}
          >
            {number}
          </button>
        ))}
      </div>
      
      <div className="number-pad-actions">
        <button 
          className="clear-button"
          onClick={onClear}
          title="Clear selected cell"
        >
          🗑️ Clear
        </button>
      </div>
    </div>
  );
};

export default NumberPad;
