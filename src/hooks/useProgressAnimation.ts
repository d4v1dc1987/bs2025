import { useState, useEffect, useRef } from 'react';

export const useProgressAnimation = (duration: number = 7000) => {
  const [progress, setProgress] = useState(0);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  const startAnimation = () => {
    setProgress(0);
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / duration) * 100, 98);
      
      setProgress(newProgress);

      if (elapsed < duration) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    cancelAnimationFrame(animationFrameRef.current!);
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setProgress(100);
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    progress,
    startAnimation,
    stopAnimation
  };
};