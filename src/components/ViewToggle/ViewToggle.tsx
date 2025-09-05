import styles from './ViewToggle.module.scss';

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className={styles.toggle}>
      <button
        className={`${styles.button} ${
          viewMode === 'grid' ? styles.active : ''
        }`}
        onClick={() => onViewModeChange('grid')}
        title='Grid view'
      >
        <i className='bi bi-grid-3x3-gap'></i>
      </button>

      <button
        className={`${styles.button} ${
          viewMode === 'list' ? styles.active : ''
        }`}
        onClick={() => onViewModeChange('list')}
        title='List view'
      >
        <i className='bi bi-list-ul'></i>
      </button>
    </div>
  );
}
