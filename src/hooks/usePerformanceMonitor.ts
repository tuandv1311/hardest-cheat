import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  fps: number;
  memory?: number;
  loadTime: number;
}

export const usePerformanceMonitor = (onMetrics?: (metrics: PerformanceMetrics) => void) => {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const startTime = useRef(performance.now());

  useEffect(() => {
    let animationId: number;

    const measurePerformance = () => {
      const currentTime = performance.now();
      frameCount.current++;

      if (currentTime - lastTime.current >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
        const loadTime = currentTime - startTime.current;
        
        const metrics: PerformanceMetrics = {
          fps,
          loadTime,
        };

        // Add memory usage if available
        if ('memory' in performance) {
          const perfMemory = performance as Performance & { memory?: { usedJSHeapSize: number } };
          metrics.memory = perfMemory.memory ? perfMemory.memory.usedJSHeapSize / 1024 / 1024 : undefined;
        }

        onMetrics?.(metrics);
        
        frameCount.current = 0;
        lastTime.current = currentTime;
      }

      animationId = requestAnimationFrame(measurePerformance);
    };

    animationId = requestAnimationFrame(measurePerformance);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [onMetrics]);
};