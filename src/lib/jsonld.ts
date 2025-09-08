// JSON-LD structured data for SEO
import { env } from './env';

export interface JsonLdData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  image: string;
  author: {
    '@type': string;
    name: string;
  };
  applicationCategory: string;
  operatingSystem: string;
  aggregateRating?: {
    '@type': string;
    ratingValue: string;
    ratingCount: string;
  };
}

export function generateWebsiteJsonLd(): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'PokeNext - Pokémon Explorer',
    description:
      'Explore the original 151 Kanto Pokémon with complete data, advanced search, filtering, and detailed information. Built with Next.js and React.',
    url: env.SITE_URL,
    image: `${env.SITE_URL}/img/og-image.webp`,
    author: {
      '@type': 'Person',
      name: 'Dave Ibarra',
    },
    applicationCategory: 'Entertainment',
    operatingSystem: 'Any',
  };
}

export function generatePokemonJsonLd(pokemon: {
  id: number;
  name: string;
  types?: Array<{ type: { name: string } }>;
  height?: number;
  weight?: number;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Thing',
    name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
    description: `${pokemon.name} is a ${pokemon.types?.map(t => t.type.name).join('/')} type Pokemon. Pokemon #${pokemon.id} from the Kanto region.`,
    url: `${env.SITE_URL}/?pokemon=${pokemon.id}`,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
    identifier: pokemon.id.toString(),
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Height',
        value: pokemon.height
          ? `${(pokemon.height / 10).toFixed(1)} m`
          : 'Unknown',
      },
      {
        '@type': 'PropertyValue',
        name: 'Weight',
        value: pokemon.weight
          ? `${(pokemon.weight / 10).toFixed(1)} kg`
          : 'Unknown',
      },
      {
        '@type': 'PropertyValue',
        name: 'Type',
        value: pokemon.types?.map(t => t.type.name).join(', ') || 'Unknown',
      },
    ],
  };
}
