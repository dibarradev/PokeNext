// API utilities for PokéAPI integration
import {
  ApiError,
  Pokemon,
  PokemonDetail,
  PokemonListResponse,
  PokemonSpecies,
} from '../types/pokemon';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

class PokemonApiError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'PokemonApiError';
    this.status = status;
    this.code = code;
  }
}

// Generic fetch wrapper with error handling
async function apiRequest<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new PokemonApiError(
        `API request failed: ${response.statusText}`,
        response.status,
        'FETCH_ERROR'
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof PokemonApiError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new PokemonApiError(
        'Network error: Please check your internet connection',
        0,
        'NETWORK_ERROR'
      );
    }

    throw new PokemonApiError(
      `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      'UNKNOWN_ERROR'
    );
  }
}

// Get list of Pokemon (first 151)
export async function fetchPokemonList(): Promise<Pokemon[]> {
  const url = `${API_BASE_URL}/pokemon?limit=151`;
  const response = await apiRequest<PokemonListResponse>(url);

  return response.results.map((pokemon, index) => ({
    id: index + 1,
    name: pokemon.name,
    url: pokemon.url,
  }));
}

// Get detailed Pokemon data
export async function fetchPokemonDetail(
  pokemonId: number
): Promise<PokemonDetail> {
  const url = `${API_BASE_URL}/pokemon/${pokemonId}`;
  return await apiRequest<PokemonDetail>(url);
}

// Get Pokemon species data (for description and flavor text)
export async function fetchPokemonSpecies(
  pokemonId: number
): Promise<PokemonSpecies> {
  const url = `${API_BASE_URL}/pokemon-species/${pokemonId}`;
  return await apiRequest<PokemonSpecies>(url);
}

// Get Pokemon by name or ID
export async function fetchPokemon(
  identifier: string | number
): Promise<PokemonDetail> {
  const url = `${API_BASE_URL}/pokemon/${identifier}`;
  return await apiRequest<PokemonDetail>(url);
}

// Get multiple Pokemon details (with concurrent fetching)
export async function fetchMultiplePokemon(
  ids: number[]
): Promise<PokemonDetail[]> {
  const promises = ids.map(id => fetchPokemonDetail(id));

  const results = await Promise.allSettled(promises);

  return results
    .filter(
      (result): result is PromiseFulfilledResult<PokemonDetail> =>
        result.status === 'fulfilled'
    )
    .map(result => result.value);
}

// Get Pokemon with complete data (detail + species)
export async function fetchCompletePokemonData(pokemonId: number): Promise<{
  detail: PokemonDetail;
  species: PokemonSpecies;
}> {
  const [detail, species] = await Promise.all([
    fetchPokemonDetail(pokemonId),
    fetchPokemonSpecies(pokemonId),
  ]);

  return { detail, species };
}

// Helper to get Pokemon image URL
export function getPokemonImageUrl(
  pokemonId: number,
  variant: 'default' | 'artwork' | 'shiny' = 'default'
): string {
  switch (variant) {
    case 'artwork':
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
    case 'shiny':
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemonId}.png`;
    default:
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
  }
}

// Helper to format Pokemon name
export function formatPokemonName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// Helper to format Pokemon ID with zero padding
export function formatPokemonId(id: number): string {
  return id.toString().padStart(3, '0');
}

// Helper to get English flavor text from species data
export function getEnglishFlavorText(species: PokemonSpecies): string {
  if (!species.flavor_text_entries) return 'No description available.';

  const englishEntry = species.flavor_text_entries.find(
    entry => entry.language.name === 'en'
  );

  if (!englishEntry) return 'No description available.';

  // Clean up the flavor text (remove form feeds and extra spaces)
  return englishEntry.flavor_text
    .replace(/\f/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Helper to convert height from decimeters to meters
export function formatHeight(heightInDecimeters: number): string {
  const meters = heightInDecimeters / 10;
  return `${meters.toFixed(1)} m`;
}

// Helper to convert weight from hectograms to kilograms
export function formatWeight(weightInHectograms: number): string {
  const kilograms = weightInHectograms / 10;
  return `${kilograms.toFixed(1)} kg`;
}

// Helper to get Pokemon type color class
export function getPokemonTypeColor(typeName: string): string {
  return `pokemon-type-${typeName.toLowerCase()}`;
}

// Error handling helper
export function handleApiError(error: unknown): ApiError {
  if (error instanceof PokemonApiError) {
    return {
      message: error.message,
      status: error.status,
      code: error.code,
    };
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
}

// Cache implementation for Pokemon data
class PokemonCache {
  private cache = new Map<string, { data: unknown; timestamp: number }>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const pokemonCache = new PokemonCache();
