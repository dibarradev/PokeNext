// React hook for managing Pokemon data and state
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError, Pokemon } from '../types/pokemon';
import {
  fetchMultiplePokemon,
  fetchPokemonList,
  handleApiError,
  pokemonCache,
} from '../utils/pokemon-api';

const ITEMS_PER_PAGE = 10;

interface UsePokemonReturn {
  // Data
  pokemon: Pokemon[];
  filteredPokemon: Pokemon[];
  currentPagePokemon: Pokemon[];

  // State
  loading: boolean;
  error: ApiError | null;

  // Pagination
  currentPage: number;
  totalPages: number;

  // View and filters
  viewMode: 'grid' | 'list';
  searchTerm: string;
  selectedTypes: string[];
  sortBy: 'id' | 'name' | 'height' | 'weight';
  sortOrder: 'asc' | 'desc';

  // Actions
  setViewMode: (mode: 'grid' | 'list') => void;
  setSearchTerm: (term: string) => void;
  setSelectedTypes: (types: string[]) => void;
  setSortBy: (sort: 'id' | 'name' | 'height' | 'weight') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setCurrentPage: (page: number) => void;
  clearFilters: () => void;
  refetch: () => Promise<void>;
}

export function usePokemon(): UsePokemonReturn {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'height' | 'weight'>(
    'id'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Load initial Pokemon list
  const loadPokemon = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedList = pokemonCache.get<Pokemon[]>('pokemon-list');
      if (cachedList) {
        setPokemon(cachedList);
        setLoading(false);
        return;
      }

      // Fetch basic list
      const basicList = await fetchPokemonList();

      // Load detailed data for first batch (for immediate display)
      const firstBatch = basicList.slice(0, ITEMS_PER_PAGE);
      const firstBatchIds = firstBatch.map(p => p.id);
      const detailedPokemon = await fetchMultiplePokemon(firstBatchIds);

      // Merge detailed data with basic list
      const enhancedList = basicList.map(basic => {
        const detailed = detailedPokemon.find(d => d.id === basic.id);
        if (detailed) {
          return {
            ...basic,
            sprite: detailed.sprites.front_default || undefined,
            types: detailed.types,
            height: detailed.height,
            weight: detailed.weight,
            abilities: detailed.abilities,
            stats: detailed.stats,
          };
        }
        return basic;
      });

      setPokemon(enhancedList);
      pokemonCache.set('pokemon-list', enhancedList);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load more detailed data as needed (lazy loading)
  const loadPokemonBatch = useCallback(
    async (startIndex: number, endIndex: number) => {
      const pokemonToLoad = pokemon.slice(startIndex, endIndex);
      const pokemonNeedingDetails = pokemonToLoad.filter(p => !p.sprite);

      if (pokemonNeedingDetails.length === 0) return;

      try {
        const ids = pokemonNeedingDetails.map(p => p.id);
        const detailedPokemon = await fetchMultiplePokemon(ids);

        setPokemon(prev =>
          prev.map(p => {
            const detailed = detailedPokemon.find(d => d.id === p.id);
            if (detailed) {
              return {
                ...p,
                sprite: detailed.sprites.front_default || undefined,
                types: detailed.types,
                height: detailed.height,
                weight: detailed.weight,
                abilities: detailed.abilities,
                stats: detailed.stats,
              };
            }
            return p;
          })
        );
      } catch (err) {
        console.error('Failed to load Pokemon batch:', err);
      }
    },
    [pokemon]
  );

  // Load all Pokemon details when type filter is applied
  const loadAllPokemonDetails = useCallback(async () => {
    const pokemonNeedingDetails = pokemon.filter(p => !p.types);

    if (pokemonNeedingDetails.length === 0) return;

    try {
      // Load in smaller batches to avoid overwhelming the API
      const batchSize = 50;
      const batches = [];

      for (let i = 0; i < pokemonNeedingDetails.length; i += batchSize) {
        batches.push(pokemonNeedingDetails.slice(i, i + batchSize));
      }

      for (const batch of batches) {
        const ids = batch.map(p => p.id);
        const detailedPokemon = await fetchMultiplePokemon(ids);

        setPokemon(prev =>
          prev.map(p => {
            const detailed = detailedPokemon.find(d => d.id === p.id);
            if (detailed && !p.types) {
              return {
                ...p,
                sprite: detailed.sprites.front_default || undefined,
                types: detailed.types,
                height: detailed.height,
                weight: detailed.weight,
                abilities: detailed.abilities,
                stats: detailed.stats,
              };
            }
            return p;
          })
        );
      }
    } catch (err) {
      console.error('Failed to load all Pokemon details:', err);
    }
  }, [pokemon]);

  // Filter and sort Pokemon
  const filteredPokemon = useMemo(() => {
    let filtered = [...pokemon];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(term) || p.id.toString().includes(term)
      );
    }

    // Apply type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(p => {
        if (!p.types) return false;
        return p.types.some(type => selectedTypes.includes(type.type.name));
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'height':
          comparison = (a.height || 0) - (b.height || 0);
          break;
        case 'weight':
          comparison = (a.weight || 0) - (b.weight || 0);
          break;
        default: // 'id'
          comparison = a.id - b.id;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [pokemon, searchTerm, selectedTypes, sortBy, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPokemon.length / ITEMS_PER_PAGE);

  const currentPagePokemon = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageData = filteredPokemon.slice(startIndex, endIndex);

    // Lazy load details for current page
    if (pageData.length > 0) {
      const originalStartIndex = pokemon.findIndex(
        p => p.id === pageData[0].id
      );
      const originalEndIndex =
        pokemon.findIndex(p => p.id === pageData[pageData.length - 1].id) + 1;

      if (originalStartIndex !== -1 && originalEndIndex !== -1) {
        loadPokemonBatch(originalStartIndex, originalEndIndex);
      }
    }

    return pageData;
  }, [filteredPokemon, currentPage, pokemon, loadPokemonBatch]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedTypes([]);
    setSortBy('id');
    setSortOrder('asc');
    setCurrentPage(1);
  }, []);

  // Refetch data
  const refetch = useCallback(async () => {
    pokemonCache.clear();
    await loadPokemon();
  }, [loadPokemon]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTypes, sortBy, sortOrder]);

  // Load all Pokemon details when type filter is applied
  useEffect(() => {
    if (selectedTypes.length > 0) {
      loadAllPokemonDetails();
    }
  }, [selectedTypes, loadAllPokemonDetails]);

  // Load data on mount
  useEffect(() => {
    loadPokemon();
  }, [loadPokemon]);

  return {
    // Data
    pokemon,
    filteredPokemon,
    currentPagePokemon,

    // State
    loading,
    error,

    // Pagination
    currentPage,
    totalPages,

    // View and filters
    viewMode,
    searchTerm,
    selectedTypes,
    sortBy,
    sortOrder,

    // Actions
    setViewMode,
    setSearchTerm,
    setSelectedTypes,
    setSortBy,
    setSortOrder,
    setCurrentPage,
    clearFilters,
    refetch,
  };
}
