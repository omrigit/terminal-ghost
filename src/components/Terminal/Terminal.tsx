import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import TerminalLine from './TerminalLine';
import type { LogLine } from './TerminalLine';
import { useSettingsStore } from '../../store/settingsStore';
import './Terminal.css';

interface TerminalProps {
  lines: LogLine[];
  isTyping?: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ lines, isTyping = false }) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const { textSize, scrollSpeed } = useSettingsStore();

  // Auto-scroll to bottom when lines change (including progress updates)
  useEffect(() => {
    if (bodyRef.current) {
      const scrollDelay = Math.max(50, 200 - scrollSpeed * 15);
      setTimeout(() => {
        if (bodyRef.current) {
          bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
      }, scrollDelay);
    }
  }, [lines, scrollSpeed]);

  return (
    <motion.div 
      className="terminal-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="terminal-header">
        <div className="terminal-buttons">
          <button className="terminal-button close" aria-label="Close" />
          <button className="terminal-button minimize" aria-label="Minimize" />
          <button className="terminal-button maximize" aria-label="Maximize" />
        </div>
        <div className="terminal-title">
          <span className="terminal-title-icon">⌘</span>
          <span>terminal — zsh — 80×24</span>
        </div>
        <div style={{ width: 52 }} /> {/* Spacer for centering */}
      </div>
      
      <div 
        ref={bodyRef}
        className="terminal-body"
        style={{ fontSize: `${textSize}px` }}
        data-speed={scrollSpeed}
      >
        {lines.map((line) => (
          <TerminalLine key={line.id} line={line} />
        ))}
        
        {isTyping && (
          <div className="terminal-line">
            <span className="terminal-cursor" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Terminal;
