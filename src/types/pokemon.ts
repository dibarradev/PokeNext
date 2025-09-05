// Pokemon types and interfaces for PokéAPI integration

export interface Pokemon {
  id: number;
  name: string;
  url: string;
  sprite?: string;
  types?: PokemonType[];
  height?: number;
  weight?: number;
  abilities?: PokemonAbility[];
  stats?: PokemonStat[];
  species?: PokemonSpecies;
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  slot: number;
  is_hidden: boolean;
  ability: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonSpecies {
  name: string;
  url: string;
  flavor_text_entries?: FlavorTextEntry[];
  habitat?: {
    name: string;
    url: string;
  };
  evolution_chain?: {
    url: string;
  };
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
    url: string;
  };
  version: {
    name: string;
    url: string;
  };
}

// API Response types
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonBasic[];
}

export interface PokemonBasic {
  name: string;
  url: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: PokemonSprites;
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  species: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  back_shiny: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
    };
    dream_world?: {
      front_default: string | null;
    };
    home?: {
      front_default: string | null;
    };
  };
}

// App state types
export interface AppState {
  pokemon: Pokemon[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  viewMode: 'grid' | 'list';
  searchTerm: string;
  selectedTypes: string[];
  sortBy: 'id' | 'name' | 'height' | 'weight';
  sortOrder: 'asc' | 'desc';
}

export interface FilterState {
  search: string;
  types: string[];
  sortBy: 'id' | 'name' | 'height' | 'weight';
  sortOrder: 'asc' | 'desc';
}

// API Error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Pokemon type names (for filtering and theming)
export type PokemonTypeName =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

export const POKEMON_TYPES: PokemonTypeName[] = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
];

// Constants
export const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48, 96] as const;
export const DEFAULT_ITEMS_PER_PAGE = 24;
export const TOTAL_POKEMON = 151; // First generation only
