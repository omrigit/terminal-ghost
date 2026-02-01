import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '../../store/settingsStore';

const NetworkActivity: React.FC = () => {
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const { isRunning, isDownloading } = useSettingsStore();

  useEffect(() => {
    if (!isRunning) {
      setDownload(0);
      setUpload(0);
      return;
    }

    const interval = setInterval(() => {
      if (isDownloading) {
        // Active download - show high download speeds, fluctuating realistically
        setDownload(Math.random() * 80 + 40); // 40-120 MB/s during download
        setUpload(Math.random() * 5 + 0.5);   // Low upload during download
      } else {
        // Idle - low background network activity
        setDownload(Math.random() * 3 + 0.1); // 0.1-3 MB/s idle
        setUpload(Math.random() * 1 + 0.05);  // Very low upload
      }
    }, 300); // Faster updates for more dynamic feel

    return () => clearInterval(interval);
  }, [isRunning, isDownloading]);

  const formatSpeed = (speed: number): string => {
    if (speed >= 1000) {
      return `${(speed / 1000).toFixed(1)} GB/s`;
    }
    return `${speed.toFixed(1)} MB/s`;
  };

  return (
    <div className="widget">
      <div className="widget-header">
        <span className="widget-title">Network</span>
      </div>
      <div className="network-container">
        <motion.div 
          className="network-stat"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <span className="network-icon download">↓</span>
          <span className="network-value">{formatSpeed(download)}</span>
          <span className="network-label">Download</span>
        </motion.div>
        <motion.div 
          className="network-stat"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <span className="network-icon upload">↑</span>
          <span className="network-value">{formatSpeed(upload)}</span>
          <span className="network-label">Upload</span>
        </motion.div>
      </div>
    </div>
  );
};

export default NetworkActivity;
