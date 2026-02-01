import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '../../store/settingsStore';

const MemoryBar: React.FC = () => {
  const [usage, setUsage] = useState(45);
  const { isRunning } = useSettingsStore();
  
  const totalMemory = 16; // GB
  const usedMemory = (usage / 100) * totalMemory;

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setUsage((prev) => {
        const change = (Math.random() - 0.5) * 5;
        let newUsage = prev + change;
        
        // Occasionally jump up (simulating new process)
        if (Math.random() > 0.97) {
          newUsage += Math.random() * 10;
        }
        // Occasionally drop (simulating process end)
        if (Math.random() > 0.98) {
          newUsage -= Math.random() * 15;
        }
        
        return Math.max(20, Math.min(85, newUsage));
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="widget">
      <div className="widget-header">
        <span className="widget-title">Memory</span>
        <span className="widget-value">{usedMemory.toFixed(1)} / {totalMemory} GB</span>
      </div>
      <div className="memory-bar-container">
        <div className="memory-bar">
          <motion.div
            className="memory-bar-fill"
            initial={{ width: '0%' }}
            animate={{ width: `${usage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="memory-bar-labels">
          <span>0 GB</span>
          <span>{totalMemory} GB</span>
        </div>
      </div>
    </div>
  );
};

export default MemoryBar;
