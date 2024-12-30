import { useState, useEffect, useRef } from 'react';

export const useProgressAnimation = (duration: number = 7000) => {
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<NodeJS.Timeout>();

  const startAnimation = () => {
    setIsAnimating(true);
    setProgress(0);

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (elapsed < duration) {
        animationRef.current = setTimeout(animate, 16); // ~60fps
      } else {
        setIsAnimating(false);
      }
    };

    animate();
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  return {
    progress,
    isAnimating,
    startAnimation
  };
};