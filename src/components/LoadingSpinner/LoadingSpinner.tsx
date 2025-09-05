import Image from 'next/image';
import styles from './LoadingSpinner.module.scss';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export function LoadingSpinner({
  size = 'medium',
  message,
}: LoadingSpinnerProps) {
  const spinnerClasses = [styles.spinner, styles[size]]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={spinnerClasses}>
      <div className={styles.spinnerContainer}>
        <Image
          src='/img/pokeball-loader.webp'
          alt='Loading'
          width={120}
          height={120}
          className={styles.pokeballImage}
        />
      </div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
