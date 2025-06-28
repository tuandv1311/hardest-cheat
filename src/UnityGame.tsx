import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';
import LoadingSpinner from './components/LoadingSpinner';
import styles from './UnityGame.module.css';

const UnityGame: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const { 
    unityProvider, 
    isLoaded, 
    loadingProgression,
    unload
  } = useUnityContext({
    loaderUrl: '/Build/HardestCheat.loader.js',
    dataUrl: '/Build/HardestCheat.data.unityweb',
    frameworkUrl: '/Build/HardestCheat.framework.js.unityweb',
    codeUrl: '/Build/HardestCheat.wasm.unityweb',
  });

  const handleResize = useCallback(() => {
    if (containerRef.current) {
      const vh = window.innerHeight * 0.01;
      containerRef.current.style.setProperty('--vh', `${vh}px`);
    }
  }, []);

  const handleRetry = useCallback(async () => {
    if (retryCount >= 3) return;
    
    setIsRetrying(true);
    setError(null);
    
    try {
      await unload();
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Unity will reinitialize automatically
      setRetryCount(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsRetrying(false);
    }
  }, [retryCount, unload]);

  useEffect(() => {
    handleResize();
    
    let timeoutId: number;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', debouncedResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('orientationchange', debouncedResize);
    };
  }, [handleResize]);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      if (!isLoaded && loadingProgression < 1) {
        setError('Loading timeout - please check your connection and try again');
      }
    }, 30000);

    return () => clearTimeout(loadingTimeout);
  }, [isLoaded, loadingProgression]);

  if (error) {
    return (
      <div ref={containerRef} className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Game Loading Error</h2>
          <p>{error}</p>
          <button
            className={styles.retryButton}
            onClick={handleRetry}
            disabled={isRetrying || retryCount >= 3}
          >
            {isRetrying ? 'Retrying...' : retryCount >= 3 ? 'Max retries reached' : `Retry (${retryCount}/3)`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <Unity 
        unityProvider={unityProvider} 
        className={`${styles.unity} ${isLoaded ? styles.loaded : styles.loading}`}
        tabIndex={1}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
      <div className={`${styles.loadingContainer} ${isLoaded ? styles.hidden : ''}`}>
        <LoadingSpinner 
          progress={loadingProgression}
          message="Loading Game..."
        />
      </div>
    </div>
  );
};

export default UnityGame;