'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface CountdownTimerProps {
  targetDate: string;
  onComplete?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = ({ targetDate, onComplete }: CountdownTimerProps) => {
  const { theme } = useTheme();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsExpired(true);
        onComplete?.();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (86400000)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (3600000)) / (1000 * 60)),
        seconds: Math.floor((difference % (60000)) / 1000),
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) {
    return (
      <div className="text-center p-4 rounded-lg bg-red-100 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400 font-medium">Event has started!</p>
      </div>
    );
  }

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 justify-center">
        <Clock size={18} className="text-primary-green-500" />
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          Event Starts In
        </span>
      </div>
      <div className="flex gap-3 justify-center">
        {timeUnits.map((unit) => (
          <div key={unit.label} className="text-center">
            <div
              className="w-16 h-16 rounded-xl flex flex-col items-center justify-center shadow-lg"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                borderWidth: 1,
              }}
            >
              <span className="text-2xl font-bold text-primary-green-500">
                {unit.value.toString().padStart(2, '0')}
              </span>
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {unit.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};