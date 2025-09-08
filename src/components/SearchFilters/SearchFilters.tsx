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
    <section
      id='searchFilters'
      role='search'
      aria-label='Pokemon search and filtering controls'
    >
      <div className='container p-0'>
        {/* Combo search input + toggle container */}
        <div className={styles.searchInputToggleContainer}>
          {/* Search Input */}
          <div className={styles.search}>
            <div className={styles.searchInput}>
              <label htmlFor='pokemon-search' className='visually-hidden'>
                Search Pokemon by name or number
              </label>
              <input
                id='pokemon-search'
                type='search'
                placeholder='Search Pokémon by name or number...'
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
                className={styles.input}
                aria-label='Search Pokemon by name or number'
                autoComplete='off'
                spellCheck='false'
              />
              <div className={styles.searchIcon} aria-hidden='true'>
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
        <fieldset className={styles.types}>
          <div className={styles.typesHeader}>
            <legend className={styles.label}>Filter by type:</legend>
            {selectedTypes.length > 0 && (
              <button
                className={styles.clearTypes}
                onClick={handleClearTypes}
                type='button'
                aria-label={`Clear ${selectedTypes.length} selected type filters`}
              >
                Clear type ({selectedTypes.length})
              </button>
            )}
          </div>

          <div
            className={styles.typesList}
            role='group'
            aria-label='Pokemon type filters'
          >
            {POKEMON_TYPES.map(type => (
              <button
                key={type}
                type='button'
                className={`${styles.typeButton} ${styles[type]} ${
                  selectedTypes.includes(type) ? styles.active : ''
                }`}
                onClick={() => handleTypeToggle(type)}
                aria-pressed={selectedTypes.includes(type)}
                aria-label={`${selectedTypes.includes(type) ? 'Remove' : 'Add'} ${type} type filter`}
              >
                {type}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Combo sort + clear filters button container */}
        <div className={styles.sortResultsContainer}>
          {/* Sort Controls */}
          <fieldset className={styles.sort}>
            <legend className='visually-hidden'>Sort Pokemon results</legend>
            <div className={styles.sortGroup}>
              <label htmlFor='sort-select' className={styles.label}>
                Sort by:
              </label>
              <select
                id='sort-select'
                value={sortBy}
                onChange={e =>
                  onSortByChange(
                    e.target.value as 'id' | 'name' | 'height' | 'weight'
                  )
                }
                className={styles.select}
                aria-label='Sort Pokemon by'
                aria-describedby='sort-order-info'
              >
                <option value='id'>Number</option>
                <option value='name'>Name</option>
                <option value='height'>Height</option>
                <option value='weight'>Weight</option>
              </select>
            </div>

            <div className={styles.sortOrderGroup}>
              <span id='sort-order-info' className='visually-hidden'>
                Currently sorted in{' '}
                {sortOrder === 'asc' ? 'ascending' : 'descending'} order
              </span>
              <label className={styles.label} htmlFor='sortOrderBtn'>
                {sortOrder === 'asc' ? 'Order: Ascending' : 'Order: Descending'}
              </label>
              <button
                id='sortOrderBtn'
                type='button'
                className={`${styles.sortOrder} ${
                  sortOrder === 'desc' ? styles.desc : ''
                }`}
                onClick={() =>
                  onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')
                }
                title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                aria-label={`Change sort order to ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                aria-pressed={sortOrder === 'desc'}
              >
                <i
                  className={`bi ${sortOrder === 'asc' ? 'bi-arrow-up-circle-fill' : 'bi-arrow-down-circle-fill'}`}
                  aria-hidden='true'
                ></i>
              </button>
            </div>
          </fieldset>

          {/* Results info */}
          <div
            className={`${styles.resultsInfo}`}
            role='status'
            aria-live='polite'
          >
            {filteredPokemonCount !== 151 && (
              <p className={`${styles.results}`}>
                <span
                  aria-label={`Showing ${filteredPokemonCount} of 151 Pokemon`}
                >
                  Showing {filteredPokemonCount} of 151 Pokémon
                </span>
                {(searchTerm || selectedTypes.length > 0) && (
                  <button
                    type='button'
                    className='btn btn-danger btn-sm rounded-pill ms-2 px-3'
                    onClick={onClearFilters}
                    aria-label='Clear all filters and show all Pokemon'
                  >
                    Clear filters
                  </button>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
