import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '../../store/settingsStore';

interface ProgressRingProps {
  size?: number;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ size = 100 }) => {
  const [progress, setProgress] = useState(0);
  const { isRunning } = useSettingsStore();
  
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        // Randomly increase progress, occasionally reset for realism
        if (Math.random() > 0.98) {
          return Math.random() * 30;
        }
        const next = prev + Math.random() * 3;
        return next >= 100 ? 0 : next;
      });
    }, 2000); // 75% slower (was 500ms, now 2000ms)

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="widget">
      <div className="widget-header">
        <span className="widget-title">Installation</span>
        <span className="widget-value">{progress.toFixed(0)}%</span>
      </div>
      <div className="progress-ring-container" style={{ position: 'relative' }}>
        <svg className="progress-ring" width={size} height={size}>
          <circle
            className="progress-ring-bg"
            cx={size / 2}
            cy={size / 2}
            r={radius}
          />
          <motion.circle
            className="progress-ring-progress"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <span className="progress-ring-text" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
          {progress.toFixed(0)}%
        </span>
      </div>
    </div>
  );
};

export default ProgressRing;
