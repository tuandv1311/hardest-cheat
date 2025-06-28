import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  progress?: number;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  progress = 0, 
  message = 'Loading...' 
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}>
        <div className={styles.circle}></div>
      </div>
      <div className={styles.message}>{message}</div>
      {progress > 0 && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className={styles.progressText}>
            {Math.round(progress * 100)}%
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;