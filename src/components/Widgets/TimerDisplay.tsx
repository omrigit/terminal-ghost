import React from 'react';
import { motion } from 'framer-motion';
import { useTimer } from '../../hooks/useTimer';

const TimerDisplay: React.FC = () => {
  const { formattedTime, isRunning } = useTimer();

  return (
    <div className="widget">
      <div className="widget-header">
        <span className="widget-title">Time Remaining</span>
        <span className="widget-value">{isRunning ? 'Running' : 'Paused'}</span>
      </div>
      <div className="timer-container">
        <motion.span
          className="timer-value"
          animate={isRunning ? { opacity: [1, 0.7, 1] } : { opacity: 1 }}
          transition={{ duration: 2, repeat: isRunning ? Infinity : 0 }}
        >
          {formattedTime}
        </motion.span>
        <span className="timer-label">MM:SS</span>
      </div>
    </div>
  );
};

export default TimerDisplay;
