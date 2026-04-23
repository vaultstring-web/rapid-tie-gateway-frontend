'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiEffectProps {
  active: boolean;
  onComplete?: () => void;
}

export const ConfettiEffect = ({ active, onComplete }: ConfettiEffectProps) => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (active && !hasRun.current) {
      hasRun.current = true;
      
      // Main burst
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#448a33', '#3b5a65', '#84cc16', '#f59e0b', '#ef4444'],
      });
      
      // Side bursts
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.5 },
          colors: ['#448a33', '#84cc16'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.5 },
          colors: ['#3b5a65', '#84cc16'],
        });
      }, 200);
      
      // Falling stars effect
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.7 },
          startVelocity: 5,
          gravity: 1,
          colors: ['#fbbf24', '#f59e0b', '#84cc16'],
        });
      }, 500);
      
      if (onComplete) {
        setTimeout(onComplete, 2000);
      }
    }
  }, [active, onComplete]);

  return null;
};