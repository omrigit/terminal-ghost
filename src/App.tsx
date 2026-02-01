import { useEffect } from 'react';
import Terminal from './components/Terminal/Terminal';
import ControlsBar from './components/Controls/ControlsBar';
import SettingsPanel from './components/Settings/SettingsPanel';
import ProgressRing from './components/Widgets/ProgressRing';
import CPUGraph from './components/Widgets/CPUGraph';
import MemoryBar from './components/Widgets/MemoryBar';
import NetworkActivity from './components/Widgets/NetworkActivity';
import Clock from './components/Widgets/Clock';
import StatsPanel from './components/Widgets/StatsPanel';
import TimerDisplay from './components/Widgets/TimerDisplay';
import { useLogEngine } from './hooks/useLogEngine';
import { useSettingsStore } from './store/settingsStore';
import { getThemeById, applyTheme } from './themes/themes';
import './components/Widgets/Widgets.css';
import './App.css';

function App() {
  const { lines, isTyping, clearLines } = useLogEngine();
  const {
    themeId,
    showProgressRing,
    showCpuGraph,
    showMemoryBar,
    showNetworkActivity,
    showClock,
    showStats,
  } = useSettingsStore();

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(getThemeById(themeId));
  }, [themeId]);

  const hasAnyWidget = showProgressRing || showCpuGraph || showMemoryBar || 
                       showNetworkActivity || showClock || showStats;

  return (
    <div className="app">
      <ControlsBar onClear={clearLines} />
      
      <main className={`main-content ${hasAnyWidget ? 'with-widgets' : 'full-width'}`}>
        <div className="terminal-wrapper">
          <Terminal lines={lines} isTyping={isTyping} />
        </div>
        
        {hasAnyWidget && (
          <aside className="widgets-sidebar">
            <div className="widgets-container">
              <TimerDisplay />
              {showClock && <Clock />}
              {showProgressRing && <ProgressRing />}
              {showCpuGraph && <CPUGraph />}
              {showMemoryBar && <MemoryBar />}
              {showNetworkActivity && <NetworkActivity />}
              {showStats && <StatsPanel linesCount={lines.length} />}
            </div>
          </aside>
        )}
      </main>

      <SettingsPanel />
    </div>
  );
}

export default App;
