import React, { useCallback } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { useTimer } from '../../hooks/useTimer';
import './Controls.css';

interface ControlsBarProps {
  onClear: () => void;
}

const ControlsBar: React.FC<ControlsBarProps> = ({ onClear }) => {
  const {
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    toggleSettings,
  } = useSettingsStore();
  
  const { formattedTime } = useTimer();

  const handleStartStop = useCallback(() => {
    if (isRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  }, [isRunning, startTimer, stopTimer]);

  const handleReset = useCallback(() => {
    resetTimer();
    onClear();
  }, [resetTimer, onClear]);

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  return (
    <div className="controls-bar">
      <div className="controls-left">
        <div className="app-title">
          <span className="app-title-icon">⌘</span>
          <span>Terminal Ghost</span>
        </div>
      </div>

      <div className="controls-center">
        <div className="timer-controls">
          <button
            className={`control-btn ${isRunning ? 'danger' : 'primary'}`}
            onClick={handleStartStop}
          >
            <span className="control-btn-icon">{isRunning ? '⏹' : '▶'}</span>
            <span>{isRunning ? 'Stop' : 'Start'}</span>
          </button>
          
          <div className={`timer-display ${isRunning ? 'running' : ''}`}>
            {formattedTime}
          </div>
          
          <button className="control-btn" onClick={handleReset}>
            <span className="control-btn-icon">↻</span>
            <span>Reset</span>
          </button>
        </div>
        
        <div className="status-indicator">
          <span className={`status-dot ${isRunning ? 'active' : ''}`} />
          <span>{isRunning ? 'Running' : 'Idle'}</span>
        </div>
      </div>

      <div className="controls-right">
        <button 
          className="icon-btn" 
          onClick={handleFullscreen}
          title="Toggle Fullscreen"
        >
          ⛶
        </button>
        <button 
          className="icon-btn" 
          onClick={toggleSettings}
          title="Settings"
        >
          ⚙
        </button>
      </div>
    </div>
  );
};

export default ControlsBar;
