import { useState, useCallback, useRef, useEffect } from 'react';
import type { LogLine, LineType } from '../components/Terminal/TerminalLine';
import { useSettingsStore } from '../store/settingsStore';
import type { LogType } from '../store/settingsStore';

// Generator imports
import { generateNpmLog } from '../generators/npm';
import { generatePipLog } from '../generators/pip';
import { generateDockerLog } from '../generators/docker';
import { generateGitLog } from '../generators/git';
import { generateCompileLog } from '../generators/compile';
import { generateServerLog } from '../generators/server';
import { generateDatabaseLog } from '../generators/database';
import { generateAiLog } from '../generators/ai';

export interface LogGenerator {
  generate: () => LogLine[];
  weight: number;
}

const generators: Record<LogType, () => LogLine[]> = {
  npm: generateNpmLog,
  pip: generatePipLog,
  docker: generateDockerLog,
  git: generateGitLog,
  compile: generateCompileLog,
  server: generateServerLog,
  database: generateDatabaseLog,
  ai: generateAiLog,
};

// Helper to generate unique IDs
let idCounter = 0;
export const generateId = (): string => `log-${++idCounter}-${Date.now()}`;

// Helper to get current timestamp
export const getTimestamp = (): string => {
  const now = new Date();
  return now.toTimeString().slice(0, 8);
};

// Helper to create a log line
export const createLogLine = (
  content: string,
  type: LineType = 'default',
  options: Partial<LogLine> = {}
): LogLine => ({
  id: generateId(),
  content,
  type,
  ...options,
});

// Random delay between log batches (ms)
const getRandomDelay = (): number => {
  const rand = Math.random();
  if (rand < 0.6) {
    // 60% chance: quick output (50-300ms)
    return 50 + Math.random() * 250;
  } else if (rand < 0.9) {
    // 30% chance: medium pause (300-1000ms)
    return 300 + Math.random() * 700;
  } else {
    // 10% chance: longer pause (1-3 seconds)
    return 1000 + Math.random() * 2000;
  }
};

export const useLogEngine = () => {
  const [lines, setLines] = useState<LogLine[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const innerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRunningRef = useRef(false);
  const activeProgressRef = useRef<Map<string, number>>(new Map());
  const { isRunning, enabledLogTypes, scrollSpeed, printSpeed, setDownloading } = useSettingsStore();

  // Keep isRunning in a ref so the loop can check it
  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  const addLines = useCallback((newLines: LogLine[]) => {
    setLines((prev) => {
      // Keep max 500 lines to prevent memory issues
      const combined = [...prev, ...newLines];
      return combined.slice(-500);
    });
  }, []);

  const clearLines = useCallback(() => {
    setLines([]);
    idCounter = 0;
    activeProgressRef.current.clear();
  }, []);

  const generateBatch = useCallback(() => {
    if (enabledLogTypes.length === 0) return [];
    
    // Pick a random enabled generator
    const randomType = enabledLogTypes[Math.floor(Math.random() * enabledLogTypes.length)];
    const generator = generators[randomType];
    
    if (generator) {
      return generator();
    }
    return [];
  }, [enabledLogTypes]);

  // Clear all timeouts helper
  const clearAllTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (innerTimeoutRef.current) {
      clearTimeout(innerTimeoutRef.current);
      innerTimeoutRef.current = null;
    }
    if (progressTimeoutRef.current) {
      clearTimeout(progressTimeoutRef.current);
      progressTimeoutRef.current = null;
    }
  }, []);

  // Update multiple lines' progress at once
  const updateMultipleProgress = useCallback((updates: Map<string, number>) => {
    setLines((prev) => prev.map((line) => {
      const newProgress = updates.get(line.id);
      if (newProgress !== undefined) {
        return { ...line, progress: newProgress };
      }
      return line;
    }));
  }, []);

  // Animate ALL progress bars to 100% simultaneously, then continue
  const animateAllProgressToComplete = useCallback((
    progressIds: string[], 
    onComplete: () => void
  ) => {
    if (!isRunningRef.current || progressIds.length === 0) {
      activeProgressRef.current.clear();
      setDownloading(false);
      onComplete();
      return;
    }

    // Signal that we're downloading
    setDownloading(true);

    // Initialize progress tracking for all bars if not already
    progressIds.forEach(id => {
      if (!activeProgressRef.current.has(id)) {
        activeProgressRef.current.set(id, 0);
      }
    });

    const animateStep = () => {
      if (!isRunningRef.current) {
        activeProgressRef.current.clear();
        setDownloading(false);
        return;
      }

      const updates = new Map<string, number>();
      let allComplete = true;

      // Update each progress bar
      activeProgressRef.current.forEach((currentProgress, lineId) => {
        if (currentProgress < 100) {
          // Calculate increment - each bar can progress at slightly different rates
          let increment: number;
          if (currentProgress < 20) {
            increment = Math.random() * 5 + 3;
          } else if (currentProgress < 80) {
            increment = Math.random() * 4 + 2;
          } else {
            increment = Math.random() * 6 + 4;
          }
          
          const nextProgress = Math.min(100, currentProgress + increment);
          activeProgressRef.current.set(lineId, nextProgress);
          updates.set(lineId, Math.round(nextProgress));
          
          if (nextProgress < 100) {
            allComplete = false;
          }
        }
      });

      // Apply all updates at once
      if (updates.size > 0) {
        updateMultipleProgress(updates);
      }

      if (allComplete) {
        // All progress bars complete
        activeProgressRef.current.clear();
        setDownloading(false);
        const speedMultiplier = 100 / printSpeed;
        progressTimeoutRef.current = setTimeout(onComplete, 200 * speedMultiplier);
      } else {
        // Continue animating
        const speedMultiplier = 100 / printSpeed;
        const delay = (150 + Math.random() * 200) * speedMultiplier;
        progressTimeoutRef.current = setTimeout(animateStep, delay);
      }
    };

    // Start animation
    animateStep();
  }, [updateMultipleProgress, printSpeed, setDownloading]);

  // Main loop
  useEffect(() => {
    if (!isRunning) {
      clearAllTimeouts();
      setIsTyping(false);
      activeProgressRef.current.clear();
      setDownloading(false);
      return;
    }

    const runLoop = () => {
      // Check if we should stop
      if (!isRunningRef.current) {
        setIsTyping(false);
        return;
      }
      
      setIsTyping(true);
      
      // Short delay to show cursor
      innerTimeoutRef.current = setTimeout(() => {
        // Check again before adding lines
        if (!isRunningRef.current) {
          setIsTyping(false);
          return;
        }
        
        const newLines = generateBatch();
        if (newLines.length > 0) {
          addLines(newLines);
          
          // Find ALL lines that have progress bars needing animation
          const progressLines = newLines.filter(line => line.isProgress && (line.progress || 0) < 100);
          
          if (progressLines.length > 0) {
            // Found progress lines - reset all to 0% and animate to 100% before continuing
            const progressIds = progressLines.map(line => line.id);
            
            // Reset all to 0%
            const resetUpdates = new Map<string, number>();
            progressIds.forEach(id => resetUpdates.set(id, 0));
            updateMultipleProgress(resetUpdates);
            
            setIsTyping(false);
            animateAllProgressToComplete(
              progressIds,
              () => {
                // After ALL progress bars complete, schedule next batch
                if (isRunningRef.current) {
                  const speedMultiplier = 100 / printSpeed;
                  const delay = (getRandomDelay() / (scrollSpeed / 5)) * speedMultiplier;
                  timeoutRef.current = setTimeout(runLoop, delay);
                }
              }
            );
            return;
          }
        }
        setIsTyping(false);
        
        // Schedule next batch only if still running
        if (isRunningRef.current) {
          // Apply print speed: 100% = normal, 50% = 2x slower, 200% = 2x faster
          const speedMultiplier = 100 / printSpeed;
          const delay = (getRandomDelay() / (scrollSpeed / 5)) * speedMultiplier;
          timeoutRef.current = setTimeout(runLoop, delay);
        }
      }, 50 + Math.random() * 100);
    };

    runLoop();

    return () => {
      clearAllTimeouts();
    };
  }, [isRunning, generateBatch, addLines, scrollSpeed, printSpeed, clearAllTimeouts, animateAllProgressToComplete, setDownloading, updateMultipleProgress]);

  return {
    lines,
    isTyping,
    addLines,
    clearLines,
  };
};
