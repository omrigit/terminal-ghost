import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LogType = 'npm' | 'pip' | 'docker' | 'git' | 'compile' | 'server' | 'database' | 'ai';

export interface SettingsState {
  // Theme
  themeId: string;
  
  // Timer
  timerMinutes: number;
  isRunning: boolean;
  timeRemaining: number;
  
  // Log settings
  enabledLogTypes: LogType[];
  scrollSpeed: number; // 1-10
  textSize: number; // 12-24
  printSpeed: number; // 50-200 (percentage)
  
  // Widget visibility
  showProgressRing: boolean;
  showCpuGraph: boolean;
  showMemoryBar: boolean;
  showNetworkActivity: boolean;
  showClock: boolean;
  showStats: boolean;
  
  // Settings panel
  isSettingsOpen: boolean;
  
  // Download activity (for network widget sync)
  isDownloading: boolean;
  setDownloading: (downloading: boolean) => void;
  
  // Actions
  setTheme: (themeId: string) => void;
  setTimerMinutes: (minutes: number) => void;
  startTimer: () => void;
  stopTimer: () => void;
  decrementTime: () => void;
  resetTimer: () => void;
  toggleLogType: (type: LogType) => void;
  setScrollSpeed: (speed: number) => void;
  setTextSize: (size: number) => void;
  setPrintSpeed: (speed: number) => void;
  toggleWidget: (widget: string) => void;
  toggleSettings: () => void;
  setSettingsOpen: (open: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Defaults
      themeId: 'matrix',
      timerMinutes: 10,
      isRunning: false,
      timeRemaining: 10 * 60,
      enabledLogTypes: ['npm', 'pip', 'docker', 'git', 'compile', 'server', 'database', 'ai'],
      scrollSpeed: 5,
      textSize: 14,
      printSpeed: 100,
      showProgressRing: true,
      showCpuGraph: true,
      showMemoryBar: true,
      showNetworkActivity: true,
      showClock: true,
      showStats: true,
      isSettingsOpen: false,
      isDownloading: false,
      
      // Actions
      setTheme: (themeId) => set({ themeId }),
      
      setTimerMinutes: (minutes) => set({ 
        timerMinutes: minutes, 
        timeRemaining: minutes * 60 
      }),
      
      startTimer: () => set({ 
        isRunning: true,
        timeRemaining: get().timerMinutes * 60
      }),
      
      stopTimer: () => set({ isRunning: false }),
      
      decrementTime: () => {
        const current = get().timeRemaining;
        if (current <= 1) {
          set({ timeRemaining: 0, isRunning: false });
        } else {
          set({ timeRemaining: current - 1 });
        }
      },
      
      resetTimer: () => set({ 
        timeRemaining: get().timerMinutes * 60,
        isRunning: false 
      }),
      
      toggleLogType: (type) => set((state) => {
        const enabled = state.enabledLogTypes;
        if (enabled.includes(type)) {
          return { enabledLogTypes: enabled.filter((t) => t !== type) };
        }
        return { enabledLogTypes: [...enabled, type] };
      }),
      
      setScrollSpeed: (speed) => set({ scrollSpeed: Math.max(1, Math.min(10, speed)) }),
      
      setTextSize: (size) => set({ textSize: Math.max(12, Math.min(24, size)) }),
      
      setPrintSpeed: (speed) => set({ printSpeed: Math.max(50, Math.min(200, speed)) }),
      
      toggleWidget: (widget) => {
        const key = `show${widget.charAt(0).toUpperCase() + widget.slice(1)}` as keyof SettingsState;
        set((state) => ({ [key]: !state[key] } as Partial<SettingsState>));
      },
      
      toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
      
      setSettingsOpen: (open) => set({ isSettingsOpen: open }),
      
      setDownloading: (downloading) => set({ isDownloading: downloading }),
    }),
    {
      name: 'terminal-screensaver-settings',
      partialize: (state) => ({
        themeId: state.themeId,
        timerMinutes: state.timerMinutes,
        enabledLogTypes: state.enabledLogTypes,
        scrollSpeed: state.scrollSpeed,
        textSize: state.textSize,
        printSpeed: state.printSpeed,
        showProgressRing: state.showProgressRing,
        showCpuGraph: state.showCpuGraph,
        showMemoryBar: state.showMemoryBar,
        showNetworkActivity: state.showNetworkActivity,
        showClock: state.showClock,
        showStats: state.showStats,
      }),
    }
  )
);
