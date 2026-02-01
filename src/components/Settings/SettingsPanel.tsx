import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '../../store/settingsStore';
import type { LogType } from '../../store/settingsStore';
import { themes, getThemeById, applyTheme } from '../../themes/themes';
import './SettingsPanel.css';

const logTypeLabels: Record<LogType, string> = {
  npm: 'npm/yarn',
  pip: 'Python pip',
  docker: 'Docker',
  git: 'Git',
  compile: 'Compilation',
  server: 'Server Logs',
  database: 'Database',
  ai: 'AI/ML Training',
};

const SettingsPanel: React.FC = () => {
  const {
    isSettingsOpen,
    setSettingsOpen,
    themeId,
    setTheme,
    timerMinutes,
    setTimerMinutes,
    enabledLogTypes,
    toggleLogType,
    scrollSpeed,
    setScrollSpeed,
    textSize,
    setTextSize,
    printSpeed,
    setPrintSpeed,
    showProgressRing,
    showCpuGraph,
    showMemoryBar,
    showNetworkActivity,
    showClock,
    showStats,
    toggleWidget,
  } = useSettingsStore();

  const handleThemeChange = (newThemeId: string) => {
    setTheme(newThemeId);
    applyTheme(getThemeById(newThemeId));
  };

  const widgets = [
    { id: 'progressRing', label: 'Progress Ring', enabled: showProgressRing },
    { id: 'cpuGraph', label: 'CPU Graph', enabled: showCpuGraph },
    { id: 'memoryBar', label: 'Memory Bar', enabled: showMemoryBar },
    { id: 'networkActivity', label: 'Network Activity', enabled: showNetworkActivity },
    { id: 'clock', label: 'Clock', enabled: showClock },
    { id: 'stats', label: 'Stats Panel', enabled: showStats },
  ];

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <>
          <motion.div
            className="settings-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSettingsOpen(false)}
          />
          <motion.div
            className="settings-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="settings-header">
              <h2>Settings</h2>
              <button 
                className="settings-close"
                onClick={() => setSettingsOpen(false)}
                aria-label="Close settings"
              >
                ×
              </button>
            </div>

            <div className="settings-content">
              {/* Timer */}
              <section className="settings-section">
                <h3>Timer Duration</h3>
                <div className="settings-slider-group">
                  <input
                    type="range"
                    min="1"
                    max="60"
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(parseInt(e.target.value))}
                    className="settings-slider"
                  />
                  <span className="settings-value">{timerMinutes} min</span>
                </div>
              </section>

              {/* Theme */}
              <section className="settings-section">
                <h3>Theme</h3>
                <div className="theme-grid">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      className={`theme-option ${themeId === theme.id ? 'active' : ''}`}
                      onClick={() => handleThemeChange(theme.id)}
                      style={{
                        '--theme-bg': theme.background,
                        '--theme-text': theme.text,
                        '--theme-accent': theme.accent,
                      } as React.CSSProperties}
                    >
                      <div className="theme-preview">
                        <div className="theme-preview-line" />
                        <div className="theme-preview-line short" />
                        <div className="theme-preview-line" />
                      </div>
                      <span className="theme-name">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Log Types */}
              <section className="settings-section">
                <h3>Log Types</h3>
                <div className="toggle-grid">
                  {(Object.keys(logTypeLabels) as LogType[]).map((type) => (
                    <label key={type} className="toggle-item">
                      <input
                        type="checkbox"
                        checked={enabledLogTypes.includes(type)}
                        onChange={() => toggleLogType(type)}
                      />
                      <span className="toggle-label">{logTypeLabels[type]}</span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Widgets */}
              <section className="settings-section">
                <h3>Widgets</h3>
                <div className="toggle-grid">
                  {widgets.map((widget) => (
                    <label key={widget.id} className="toggle-item">
                      <input
                        type="checkbox"
                        checked={widget.enabled}
                        onChange={() => toggleWidget(widget.id)}
                      />
                      <span className="toggle-label">{widget.label}</span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Text Size */}
              <section className="settings-section">
                <h3>Text Size</h3>
                <div className="settings-slider-group">
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={textSize}
                    onChange={(e) => setTextSize(parseInt(e.target.value))}
                    className="settings-slider"
                  />
                  <span className="settings-value">{textSize}px</span>
                </div>
              </section>

              {/* Scroll Speed */}
              <section className="settings-section">
                <h3>Scroll Speed</h3>
                <div className="settings-slider-group">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={scrollSpeed}
                    onChange={(e) => setScrollSpeed(parseInt(e.target.value))}
                    className="settings-slider"
                  />
                  <span className="settings-value">{scrollSpeed}x</span>
                </div>
              </section>

              {/* Print Speed */}
              <section className="settings-section">
                <h3>Print Speed</h3>
                <div className="settings-slider-group">
                  <input
                    type="range"
                    min="50"
                    max="200"
                    step="5"
                    value={printSpeed}
                    onChange={(e) => setPrintSpeed(parseInt(e.target.value))}
                    className="settings-slider"
                  />
                  <span className="settings-value">{printSpeed}%</span>
                </div>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;
