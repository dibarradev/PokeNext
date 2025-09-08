import { Metadata } from 'next';
import { env } from './env';

interface MetaTagsConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  pokemon?: {
    id: number;
    name: string;
    types?: string[];
  };
}

const defaultConfig = {
  title: 'PokeNext - Pokemon Explorer',
  description:
    'Explore the original 151 Kanto Pokemon with complete data, advanced search, filtering, and detailed information. Built with Next.js and React.',
  image: '/img/og-image.webp',
  url: env.SITE_URL,
  type: 'website' as const,
};

export function generateMetadata(config: MetaTagsConfig = {}): Metadata {
  const meta = { ...defaultConfig, ...config };

  // If it's a Pokemon page, customize the metadata
  if (config.pokemon) {
    const { id, name, types } = config.pokemon;
    const pokemonName = name.charAt(0).toUpperCase() + name.slice(1);
    const typeText = types ? types.join('/') : '';

    meta.title = `${pokemonName} - Pokemon #${id} | PokeNext`;
    meta.description = `Discover ${pokemonName}, a ${typeText} type Pokemon from the Kanto region. Explore stats, abilities, and detailed information about Pokemon #${id}.`;
    meta.image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    meta.url = `${defaultConfig.url}/?pokemon=${id}`;
  }

  return {
    metadataBase: new URL(env.SITE_URL),
    title: meta.title,
    description: meta.description,
    keywords: [
      'Pokemon',
      'Pokedex',
      'Kanto',
      'Generation 1',
      'Pokemon data',
      'Pokemon stats',
      'Pokemon types',
      'Pokemon abilities',
      'Next.js',
      'React',
      'Pokemon explorer',
      'Pokemon search',
      'Pokemon filter',
    ],
    authors: [{ name: 'Dave Ibarra' }],
    creator: 'Dave Ibarra',
    publisher: 'Dave Ibarra',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: meta.type,
      locale: 'en_US',
      url: meta.url,
      title: meta.title,
      description: meta.description,
      siteName: 'PokeNext - Pokemon Explorer',
      images: [
        {
          url: meta.image,
          width: 1200,
          height: 630,
          alt: config.pokemon
            ? `${config.pokemon.name} - Pokemon #${config.pokemon.id}`
            : 'PokeNext - Pokemon Explorer',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      creator: '@dibarradev',
      images: [meta.image],
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/img/pokenext_logo.webp',
    },
    manifest: '/manifest.json',
    other: {
      'theme-color': '#dc2626',
      'color-scheme': 'light dark',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': 'PokeNext',
      'mobile-web-app-capable': 'yes',
    },
  };
}

// For specific Pokemon pages
export function generatePokemonMetadata(pokemon: {
  id: number;
  name: string;
  types?: Array<{ type: { name: string } }>;
}): Metadata {
  return generateMetadata({
    pokemon: {
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types?.map(t => t.type.name),
    },
  });
}
