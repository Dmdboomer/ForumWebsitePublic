import React from 'react';
import PropTypes from 'prop-types';

// Moved outside component for better performance
function getDarkenedColor(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Darken by 20% for more noticeable difference
    const darken = (c) => Math.max(0, Math.floor(c * 0.8));
    const dr = darken(r);
    const dg = darken(g);
    const db = darken(b);

    const componentToHex = (c) => {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + componentToHex(dr) + componentToHex(dg) + componentToHex(db);
}

const ScoreBar = ({ 
  score, 
  max = 100, 
  height = 12,
  color = "#4285F4",
  label,
  showValueInside = false,
  isCompleted = false
}) => {
  // Handle null or -1 scores
  if (score === null || score === -1) {
    return(
      <div style={{ textAlign: 'center', padding: '8px 0', fontStyle: 'italic', color: '#757575' }}>
        Score: N/A (No completed Leafs yet)
      </div>
    )
  }
  score = (score*100).toFixed(2)

  const percentage = Math.max(0, Math.min(max, score || 0)) / max * 100;
  const barHeight = Math.max(12, height);
  
  // Generate gradient colors for completed state
  let backgroundGradient;
  if (isCompleted) {
    const darkened = getDarkenedColor(color);
    backgroundGradient = `linear-gradient(to right, ${darkened}99, ${darkened})`;
  } else {
    backgroundGradient = `linear-gradient(to right, ${color}99, ${color}ff)`;
  }

  // Styles conditional on isCompleted
  const fillStyles = {
    width: `${percentage}%`,
    height: '100%',
    transition: 'width 0.3s ease',
    boxShadow: 'inset 0 0 8px rgba(255,255,255,0.3)',
    borderTopLeftRadius: barHeight / 2,
    borderBottomLeftRadius: barHeight / 2,
    borderTopRightRadius: percentage >= 99.5 ? barHeight / 2 : 0,
    borderBottomRightRadius: percentage >= 99.5 ? barHeight / 2 : 0,
    position: 'relative',
    background: backgroundGradient,
    border: isCompleted ? '2px solid rgba(0,0,0,0.3)' : 'none',
  };

  return (
    <div className="score-bar-container" style={{ margin: '8px 0' }}>
      {label && (
        <div 
          className="score-label" 
          style={{ 
            fontWeight: 'bold', 
            marginBottom: 4,
            fontSize: '0.85rem'
          }}
        >
          {label}
        </div>
      )}
      
      <div 
        className="score-bar-background" 
        style={{ 
          height: barHeight,
          backgroundColor: "--text-secondary",
          borderRadius: barHeight / 2,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
          border: isCompleted ? '1px solid rgba(0,0,0,0.4)' : 'none'
        }}
      >
        <div 
          className="score-bar-fill"
          style={fillStyles}
        />
        
        {isCompleted && (
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            textShadow: '0 1px 1px rgba(0,0,0,0.3)',
            fontSize: Math.max(10, barHeight * 0.7),
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            pointerEvents: 'none'  // Ensure it doesn't block interactions
          }}>
            (completed)
          </div>
        )}
      </div>
      
      {!showValueInside && (
        <div 
          className="score-value" 
          style={{ 
            textAlign: 'right', 
            fontSize: '0.85rem',
            marginTop: 4
          }}
        >
          {score !== null && score !== undefined ? `${score}/${max}` : 'N/A'}
        </div>
      )}
    </div>
  );
};

ScoreBar.propTypes = {
  score: PropTypes.number,
  max: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  label: PropTypes.string,
  showValueInside: PropTypes.bool,
  isCompleted: PropTypes.bool
};

export default ScoreBar;