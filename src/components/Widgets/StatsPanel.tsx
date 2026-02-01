import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../../store/settingsStore';

interface StatsPanelProps {
  linesCount: number;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ linesCount }) => {
  const [packagesInstalled, setPackagesInstalled] = useState(0);
  const [errors, setErrors] = useState(0);
  const { isRunning, timerMinutes, timeRemaining } = useSettingsStore();

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setPackagesInstalled((prev) => prev + Math.floor(Math.random() * 3) + 1);
      }
      if (Math.random() > 0.95) {
        setErrors((prev) => prev + 1);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatElapsed = (): string => {
    const mins = Math.floor((timerMinutes * 60 - timeRemaining) / 60);
    const secs = (timerMinutes * 60 - timeRemaining) % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="widget">
      <div className="widget-header">
        <span className="widget-title">Statistics</span>
      </div>
      <div className="stats-container">
        <div className="stat-item">
          <span className="stat-value">{linesCount}</span>
          <span className="stat-label">Lines</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{packagesInstalled}</span>
          <span className="stat-label">Packages</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{errors}</span>
          <span className="stat-label">Errors</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{formatElapsed()}</span>
          <span className="stat-label">Elapsed</span>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
