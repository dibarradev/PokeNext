'use client';

import Image from 'next/image';
import { useState } from 'react';
import { usePokemon } from '../../hooks/usePokemon';
import { Pokemon } from '../../types/pokemon';
import { ErrorMessage } from '../ErrorMessage';
import { LoadingSpinner } from '../LoadingSpinner';
import { Pagination } from '../Pagination';
import { PokemonCard } from '../PokemonCard';
import { PokemonListCard } from '../PokemonListCard';
import { PokemonModal } from '../PokemonModal';
import { SearchFilters } from '../SearchFilters';
import styles from './PokemonList.module.scss';

export function PokemonList() {
  const {
    currentPagePokemon,
    filteredPokemon,
    loading,
    error,
    currentPage,
    totalPages,
    viewMode,
    searchTerm,
    selectedTypes,
    sortBy,
    sortOrder,
    setViewMode,
    setSearchTerm,
    setSelectedTypes,
    setSortBy,
    setSortOrder,
    setCurrentPage,
    clearFilters,
    refetch,
  } = usePokemon();

  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
  };

  const siteLogo = (
    <Image
      src='/img/pokenext_logo.webp'
      alt='Pokémon Logo'
      width={300}
      height={93}
      className={styles.siteLogo}
    />
  );

  const eyeCatchTextFragment = (
    <p className={`fs-5 ${styles.eyecatchText}`}>
      Discover and explore the first 151 Pokémon
    </p>
  );

  // Loading state
  if (loading && currentPagePokemon.length === 0) {
    return (
      <div className={styles.container}>
        <div className='text-center mb-5'>
          {siteLogo}
          <h1 className={styles.title}>{eyeCatchTextFragment}</h1>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (error && currentPagePokemon.length === 0) {
    return (
      <div className={styles.container}>
        <div className='text-center mb-5'>
          {siteLogo}
          <h1 className={styles.title}>{eyeCatchTextFragment}</h1>
        </div>
        <ErrorMessage error={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className='text-center mb-5'>
        {siteLogo}
        <h1 className={styles.title}>{eyeCatchTextFragment}</h1>
      </div>

      {/* Controls */}
      <div className='mb-4'>
        <SearchFilters
          searchTerm={searchTerm}
          selectedTypes={selectedTypes}
          sortBy={sortBy}
          sortOrder={sortOrder}
          viewMode={viewMode}
          filteredPokemonCount={filteredPokemon.length}
          onSearchChange={setSearchTerm}
          onTypesChange={setSelectedTypes}
          onSortByChange={setSortBy}
          onSortOrderChange={setSortOrder}
          onViewModeChange={setViewMode}
          onClearFilters={clearFilters}
        />
      </div>

      {/* Pokemon Grid/List */}
      {currentPagePokemon.length === 0 ? (
        <div
          className='d-flex justify-content-center align-items-center'
          style={{ minHeight: '400px' }}
        >
          <div className={`${styles.noFoundBlock} text-center`}>
            <div className='display-1 mb-3'>
              <Image
                src='/img/unown_search.webp'
                alt='No Pokémon found'
                width={80}
                height={90}
                className={styles.noResultsIcon}
              />
            </div>
            <h3 className='mb-3'>No Pokémon found</h3>
            <p className='mb-3'>Try adjusting your search or filters</p>
            <button className='btn btn-primary' onClick={clearFilters}>
              Clear all filters
            </button>
          </div>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className='row g-4 mb-5'>
              {currentPagePokemon.map(pokemon => (
                <div key={pokemon.id} className='col-12 col-md-6 col-lg-4'>
                  <PokemonCard
                    pokemon={pokemon}
                    onClick={() => handlePokemonClick(pokemon)}
                    loading={loading && !pokemon.sprite}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={`${styles.grid} ${styles.listView}`}>
              {currentPagePokemon.map(pokemon => (
                <div key={pokemon.id}>
                  <PokemonListCard
                    pokemon={pokemon}
                    onClick={() => handlePokemonClick(pokemon)}
                    loading={loading && !pokemon.sprite}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {/* Loading overlay for pagination */}
      {loading && currentPagePokemon.length > 0 && (
        <div className={styles.loadingOverlay}>
          <LoadingSpinner size='small' />
        </div>
      )}

      {/* Modal */}
      <PokemonModal
        pokemon={selectedPokemon}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
