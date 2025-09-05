import { POKEMON_TYPES } from '../../types/pokemon';
import { ViewToggle } from '../ViewToggle';
import styles from './SearchFilters.module.scss';

interface SearchFiltersProps {
  searchTerm: string;
  selectedTypes: string[];
  sortBy: 'id' | 'name' | 'height' | 'weight';
  sortOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'list';
  filteredPokemonCount: number;
  onSearchChange: (term: string) => void;
  onTypesChange: (types: string[]) => void;
  onSortByChange: (sortBy: 'id' | 'name' | 'height' | 'weight') => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onClearFilters: () => void;
}

export function SearchFilters({
  searchTerm,
  selectedTypes,
  sortBy,
  sortOrder,
  viewMode,
  filteredPokemonCount,
  onSearchChange,
  onTypesChange,
  onSortByChange,
  onSortOrderChange,
  onViewModeChange,
  onClearFilters,
}: SearchFiltersProps) {
  const handleTypeToggle = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter(t => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  const handleClearTypes = () => {
    onTypesChange([]);
  };

  return (
    <div>
      <div className='container p-0'>
        {/* Combo search input + toggle container */}
        <div className={styles.searchInputToggleContainer}>
          {/* Search Input */}
          <div className={styles.search}>
            <div className={styles.searchInput}>
              <input
                type='text'
                placeholder='Search Pokémon by name or number...'
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
                className={styles.input}
              />
              <div className={styles.searchIcon}>
                <i className='bi bi-search'></i>
              </div>
            </div>
          </div>

          {/* View Toggle */}
          <div className={styles.viewToggle}>
            <ViewToggle
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
            />
          </div>
        </div>

        {/* Type Filters */}
        <div className={styles.types}>
          <div className={styles.typesHeader}>
            <label className={styles.label}>Filter by type:</label>
            {selectedTypes.length > 0 && (
              <button className={styles.clearTypes} onClick={handleClearTypes}>
                Clear type ({selectedTypes.length})
              </button>
            )}
          </div>

          <div className={styles.typesList}>
            {POKEMON_TYPES.map(type => (
              <button
                key={type}
                className={`${styles.typeButton} ${styles[type]} ${
                  selectedTypes.includes(type) ? styles.active : ''
                }`}
                onClick={() => handleTypeToggle(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Combo sort + clear filters button container */}
        <div className={styles.sortResultsContainer}>
          {/* Sort Controls */}
          <div className={styles.sort}>
            <div className={styles.sortGroup}>
              <label className={styles.label}>Sort by:</label>
              <select
                value={sortBy}
                onChange={e =>
                  onSortByChange(
                    e.target.value as 'id' | 'name' | 'height' | 'weight'
                  )
                }
                className={styles.select}
              >
                <option value='id'>Number</option>
                <option value='name'>Name</option>
                <option value='height'>Height</option>
                <option value='weight'>Weight</option>
              </select>
            </div>

            <div className={styles.sortOrderGroup}>
              <label className={styles.label} htmlFor='sortOrderBtn'>
                {sortOrder === 'asc' ? 'Order: Ascending' : 'Order: Descending'}
              </label>
              <button
                id='sortOrderBtn'
                className={`${styles.sortOrder} ${
                  sortOrder === 'desc' ? styles.desc : ''
                }`}
                onClick={() =>
                  onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')
                }
                title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
              >
                <i
                  className={`bi ${sortOrder === 'asc' ? 'bi-arrow-up-circle-fill' : 'bi-arrow-down-circle-fill'}`}
                ></i>
              </button>
            </div>
          </div>

          {/* Results info */}
          <div className={`${styles.resultsInfo}`}>
            {filteredPokemonCount !== 151 && (
              <p className={`mb-0 ${styles.results}`}>
                Showing {filteredPokemonCount} of 151 Pokémon
                {(searchTerm || selectedTypes.length > 0) && (
                  <button
                    className='btn btn-danger btn-sm rounded-pill ms-2 px-3'
                    onClick={onClearFilters}
                  >
                    Clear filters
                  </button>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
