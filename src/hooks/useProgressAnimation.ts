import { useState, useEffect, useRef } from 'react';

export const useProgressAnimation = (duration: number = 7000) => {
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();

  const startAnimation = () => {
    setIsAnimating(true);
    setProgress(0);
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / duration) * 100, 98);
      
      setProgress(newProgress);

      if (elapsed < duration && isAnimating) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animate(); // Start the animation immediately
  };

  const stopAnimation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setProgress(100);
    setIsAnimating(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    progress,
    isAnimating,
    startAnimation,
    stopAnimation
  };
};