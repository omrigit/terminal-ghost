import React, { useState, useEffect, useRef } from 'react';
import { useSettingsStore } from '../../store/settingsStore';

const CPUGraph: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<number[]>(Array(30).fill(50));
  const { isRunning } = useSettingsStore();
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    let lastUpdate = Date.now();

    const updateData = () => {
      const now = Date.now();
      if (now - lastUpdate >= 500) {
        setDataPoints((prev) => {
          const newPoints = [...prev.slice(1)];
          // Generate a somewhat realistic CPU pattern
          const lastValue = prev[prev.length - 1];
          const change = (Math.random() - 0.5) * 30;
          let newValue = lastValue + change;
          
          // Add occasional spikes
          if (Math.random() > 0.95) {
            newValue = Math.random() * 40 + 60;
          }
          
          // Clamp between 5 and 95
          newValue = Math.max(5, Math.min(95, newValue));
          newPoints.push(newValue);
          return newPoints;
        });
        lastUpdate = now;
      }
      animationRef.current = requestAnimationFrame(updateData);
    };

    animationRef.current = requestAnimationFrame(updateData);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning]);

  const width = 200;
  const height = 60;
  const padding = 5;

  const points = dataPoints.map((value, index) => {
    const x = padding + (index / (dataPoints.length - 1)) * (width - padding * 2);
    const y = height - padding - (value / 100) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  const currentValue = dataPoints[dataPoints.length - 1];

  return (
    <div className="widget">
      <div className="widget-header">
        <span className="widget-title">CPU Usage</span>
        <span className="widget-value">{currentValue.toFixed(0)}%</span>
      </div>
      <div className="cpu-graph-container">
        <svg className="cpu-graph-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="cpuGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'var(--accent)', stopOpacity: 0.5 }} />
              <stop offset="100%" style={{ stopColor: 'var(--accent)', stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[25, 50, 75].map((percent) => (
            <line
              key={percent}
              className="cpu-graph-grid-line"
              x1={padding}
              y1={height - padding - (percent / 100) * (height - padding * 2)}
              x2={width - padding}
              y2={height - padding - (percent / 100) * (height - padding * 2)}
            />
          ))}
          
          {/* Area fill */}
          <polygon className="cpu-graph-area" points={areaPoints} />
          
          {/* Line */}
          <polyline className="cpu-graph-line" points={points} />
        </svg>
      </div>
    </div>
  );
};

export default CPUGraph;
