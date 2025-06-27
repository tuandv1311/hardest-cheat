import React, { useEffect, useRef } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';

const UnityGame: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
    loaderUrl: '/Build/HardestCheat.loader.js',
    dataUrl: '/Build/HardestCheat.data.unityweb',
    frameworkUrl: '/Build/HardestCheat.framework.js.unityweb',
    codeUrl: '/Build/HardestCheat.wasm.unityweb',
  });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const vh = window.innerHeight * 0.01;
        containerRef.current.style.setProperty('--vh', `${vh}px`);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: 'calc(var(--vh, 1vh) * 100)',
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    overflow: 'hidden',
  };

  const unityStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: isLoaded ? 'block' : 'none',
  };

  const loadingStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    fontSize: '18px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    display: isLoaded ? 'none' : 'block',
  };

  const progressBarStyle: React.CSSProperties = {
    width: '300px',
    height: '20px',
    backgroundColor: '#333',
    borderRadius: '10px',
    overflow: 'hidden',
    marginTop: '20px',
  };

  const progressFillStyle: React.CSSProperties = {
    height: '100%',
    backgroundColor: '#4CAF50',
    width: `${loadingProgression * 100}%`,
    transition: 'width 0.3s ease',
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      <Unity 
        unityProvider={unityProvider} 
        style={unityStyle}
        tabIndex={1}
      />
      <div style={loadingStyle}>
        <div>Loading Game...</div>
        <div style={progressBarStyle}>
          <div style={progressFillStyle}></div>
        </div>
        <div>{Math.round(loadingProgression * 100)}%</div>
      </div>
    </div>
  );
};

export default UnityGame;