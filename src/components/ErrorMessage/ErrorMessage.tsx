import { ApiError } from '../../types/pokemon';
import styles from './ErrorMessage.module.scss';

interface ErrorMessageProps {
  error: ApiError;
  onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  const getErrorTitle = (code?: string) => {
    switch (code) {
      case 'NETWORK_ERROR':
        return 'Connection Error';
      case 'FETCH_ERROR':
        return 'Failed to Load Data';
      case 'UNKNOWN_ERROR':
      default:
        return 'Something Went Wrong';
    }
  };

  const getErrorIcon = (code?: string) => {
    switch (code) {
      case 'NETWORK_ERROR':
        return '🌐';
      case 'FETCH_ERROR':
        return '⚠️';
      default:
        return '❌';
    }
  };

  return (
    <div className={styles.error}>
      <div className={styles.content}>
        <div className={styles.icon}>{getErrorIcon(error.code)}</div>
        <h3 className={styles.title}>{getErrorTitle(error.code)}</h3>
        <p className={styles.description}>{error.message}</p>
        {onRetry && (
          <button className={styles.retry} onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
