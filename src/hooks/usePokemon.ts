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
  // Data state
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // UI state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'height' | 'weight'>(
    'id'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Load initial Pokemon list with complete data (first 151)
  const loadPokemon = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedList = pokemonCache.get<Pokemon[]>('pokemon-list-complete');
      if (cachedList) {
        setPokemon(cachedList);
        setLoading(false);
        return;
      }

      // Fetch basic list (first 151)
      const basicList = await fetchPokemonList();

      // Fetch detailed data for all 151 Pokemon
      const detailedPokemon = await fetchMultiplePokemon(
        basicList.map(p => p.id)
      );

      // Combine basic info with detailed data
      const completeList = basicList.map(basic => {
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

      // Cache the complete list
      pokemonCache.set('pokemon-list-complete', completeList);
      setPokemon(completeList);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError);
      console.error('Failed to load Pokemon:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and sort Pokemon (all Pokemon already have complete data)
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

  // Calculate pagination
  const currentPagePokemon = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredPokemon.slice(startIndex, endIndex);
  }, [filteredPokemon, currentPage]);

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
