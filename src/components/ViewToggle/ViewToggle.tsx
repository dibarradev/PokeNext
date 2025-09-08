import styles from './ViewToggle.module.scss';

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className={styles.toggle} role='group' aria-label='View mode options'>
      <button
        className={`${styles.button} ${
          viewMode === 'grid' ? styles.active : ''
        }`}
        onClick={() => onViewModeChange('grid')}
        title='Grid view'
        aria-label='Switch to grid view'
        aria-pressed={viewMode === 'grid'}
      >
        <i className='bi bi-grid-3x3-gap' aria-hidden='true'></i>
      </button>

      <button
        className={`${styles.button} ${
          viewMode === 'list' ? styles.active : ''
        }`}
        onClick={() => onViewModeChange('list')}
        title='List view'
        aria-label='Switch to list view'
        aria-pressed={viewMode === 'list'}
      >
        <i className='bi bi-list-ul' aria-hidden='true'></i>
      </button>
    </div>
  );
}
