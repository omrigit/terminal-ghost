import React from 'react';

export type LineType = 'default' | 'success' | 'warning' | 'error' | 'info' | 'dim' | 'accent' | 'accent-secondary';

export interface LogLine {
  id: string;
  timestamp?: string;
  prefix?: string;
  content: string;
  type: LineType;
  isProgress?: boolean;
  progress?: number;
  glow?: boolean;
}

interface TerminalLineProps {
  line: LogLine;
}

const TerminalLine: React.FC<TerminalLineProps> = ({ line }) => {
  // Explicitly extract progress for React to track changes
  const progressValue = line.isProgress ? (line.progress ?? 0) : 0;
  
  return (
    <div className={`terminal-line ${line.glow ? 'glow' : ''}`}>
      {line.timestamp && (
        <span className="terminal-timestamp">[{line.timestamp}]</span>
      )}
      {line.prefix && (
        <span className="terminal-prefix">{line.prefix}</span>
      )}
      {line.isProgress ? (
        <div className="terminal-progress">
          <div className="terminal-progress-bar">
            <div 
              className="terminal-progress-fill" 
              style={{ width: `${progressValue}%` }}
            />
          </div>
          <span className="terminal-progress-text">
            {Math.round(progressValue)}%
          </span>
          <span className={`terminal-content ${line.type}`}>
            {line.content}
          </span>
        </div>
      ) : (
        <span className={`terminal-content ${line.type}`}>
          {line.content}
        </span>
      )}
    </div>
  );
};

export default TerminalLine;
