'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { animations, useGSAP } from '../../hooks/useGSAP';
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
    filteredPokemon,
    currentPagePokemon,
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

  // GSAP animations
  const { gsap } = useGSAP();

  // Track if initial animations have been done
  const hasAnimatedGrid = useRef(false);
  const previousPokemonIds = useRef<string>('');
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Animate header elements on mount
  useEffect(() => {
    if (!loading) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        animations.siteLogo('#site-logo');
        animations.fadeUp('#eyecatch-text', 0.2);
        animations.fadeUp('#searchFilters', 0.4);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Animate grid cards when data changes
  useEffect(() => {
    if (!loading) {
      // Create a unique ID for current pokemon list
      const currentPokemonIds = currentPagePokemon.map(p => p.id).join(',');

      // Clear any existing timeout to prevent multiple animations
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
        fallbackTimeoutRef.current = null;
      }

      if (currentPagePokemon.length > 0) {
        // Only animate if the pokemon list has actually changed
        if (currentPokemonIds !== previousPokemonIds.current) {
          // Kill any existing animations on the card wrappers
          gsap.killTweensOf('.pokemon-card-wrapper');

          // Reset elements to initial state first
          gsap.set('.pokemon-card-wrapper', { opacity: 0, y: 20 });

          // Debounced animation with special handling for initial load
          const delay = isInitialLoad.current ? 300 : 100;

          animationTimeoutRef.current = setTimeout(() => {
            // Double-check elements still exist and should be animated
            const elements = document.querySelectorAll('.pokemon-card-wrapper');
            if (elements.length > 0 && currentPagePokemon.length > 0) {
              animations.gridCascade('.pokemon-card-wrapper', 0.1);
              previousPokemonIds.current = currentPokemonIds;
              hasAnimatedGrid.current = true;
              isInitialLoad.current = false;
            }
          }, delay);

          // Fallback mechanism to ensure visibility if animation fails
          fallbackTimeoutRef.current = setTimeout(() => {
            const elements = document.querySelectorAll('.pokemon-card-wrapper');
            if (elements.length > 0 && currentPagePokemon.length > 0) {
              const hiddenElements = Array.from(elements).filter(el => {
                const styles = window.getComputedStyle(el as Element);
                return styles.opacity === '0';
              });
              if (hiddenElements.length > 0) {
                console.warn('Fallback: Making hidden elements visible');
                gsap.set(hiddenElements, { opacity: 1, y: 0 });
              }
            }
          }, delay + 1000); // Execute fallback 1 second after main animation should have completed
        } else if (hasAnimatedGrid.current) {
          // If same pokemon list but elements might be hidden, ensure they're visible
          const elements = document.querySelectorAll('.pokemon-card-wrapper');
          if (elements.length > 0) {
            gsap.set('.pokemon-card-wrapper', { opacity: 1, y: 0 });
          }
        }
      } else {
        // No pokemon, ensure any visible cards are hidden
        gsap.set('.pokemon-card-wrapper', { opacity: 0 });
        previousPokemonIds.current = '';
      }
    }
  }, [currentPagePokemon, viewMode, loading, gsap]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
      }
    };
  }, []);

  // Animate noFoundBlock when it appears
  useEffect(() => {
    if (!loading && currentPagePokemon.length === 0) {
      // Ensure grid cards are hidden when showing no found block
      gsap.set('.pokemon-card-wrapper', { opacity: 0 });

      const noFoundElement = document.getElementById('no-found-block');
      if (noFoundElement) {
        // Kill any existing animations
        gsap.killTweensOf('#no-found-block');

        // Reset to initial state
        gsap.set('#no-found-block', { opacity: 0, y: 30, scale: 0.9 });

        // Animate with a small delay
        setTimeout(() => {
          animations.noFoundBlock('#no-found-block');
        }, 100);
      }
    } else if (currentPagePokemon.length > 0) {
      // Hide no found block when there are pokemon
      gsap.set('#no-found-block', { opacity: 0 });
    }
  }, [currentPagePokemon, loading, gsap]);

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
      id='site-logo'
      src='/img/pokenext_logo.webp'
      alt='Pokémon Logo'
      width={300}
      height={93}
      className={styles.siteLogo}
      priority={true}
      fetchPriority='high'
    />
  );

  const eyeCatchTextFragment = (
    <span>Discover and explore the first 151 Pokémon</span>
  );

  const titleFragment = (
    <h1
      id='eyecatch-text'
      className={`fs-5 ${styles.eyecatchText} ${styles.title}`}
    >
      {eyeCatchTextFragment}
    </h1>
  );

  // Loading state
  if (loading && currentPagePokemon.length === 0) {
    return (
      <div className={styles.container}>
        <div className='text-center mb-5'>
          {siteLogo}
          {titleFragment}
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
          {titleFragment}
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
        {titleFragment}
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
          <div
            id='no-found-block'
            className={`${styles.noFoundBlock} text-center`}
          >
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
            <div id='pokemon-grid' className='row g-4 mb-5'>
              {currentPagePokemon.map(pokemon => (
                <div
                  key={pokemon.id}
                  className='col-12 col-md-6 col-lg-4 pokemon-card-wrapper'
                >
                  <PokemonCard
                    pokemon={pokemon}
                    onClick={() => handlePokemonClick(pokemon)}
                    loading={loading && !pokemon.sprite}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`${styles.grid} ${styles.listView}`}
              id='pokemon-list'
            >
              {currentPagePokemon.map(pokemon => (
                <div key={pokemon.id} className='pokemon-card-wrapper'>
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
