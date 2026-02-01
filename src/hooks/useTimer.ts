import { useEffect, useRef } from 'react';
import { useSettingsStore } from '../store/settingsStore';

export const useTimer = () => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { isRunning, timeRemaining, decrementTime, stopTimer } = useSettingsStore();

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        decrementTime();
      }, 1000);
    } else if (timeRemaining <= 0) {
      stopTimer();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeRemaining, decrementTime, stopTimer]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    isRunning,
  };
};
