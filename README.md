# PokeNext

A modern Pokemon application built with Next.js 15, featuring the original 151 Kanto Pokemon with complete data integration, advanced animations, and responsive design.

## Features

- **Complete Pokemon Data**: All 151 original Pokemon with types, heights, weights, abilities, and stats
- **Advanced Search & Filtering**: Search by name/ID, filter by types, sort by various criteria
- **Smooth Animations**: GSAP-powered animations with WebKit compatibility
- **Responsive Design**: Grid/List view modes with mobile-first approach
- **Modal Details**: Detailed Pokemon information with species descriptions
- **Performance Optimized**: Intelligent caching system and batch API loading
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 15.5.2 with Turbopack
- **Runtime**: React 19.1.0
- **Language**: TypeScript
- **Styling**: SCSS with Bootstrap 5.3.8
- **Icons**: Bootstrap Icons 1.13.1
- **Animations**: GSAP 3.13.0
- **API**: PokéAPI integration
- **Build Tool**: Turbopack for fast development

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── LoadingSpinner/    # Loading spinner component
│   ├── PokemonCard/       # Pokemon card display
│   ├── PokemonList/       # Main Pokemon list with grid/list views
│   ├── PokemonModal/      # Detailed Pokemon modal
│   ├── SearchFilters/     # Search and filter controls
│   └── ViewToggle/        # Grid/List view toggle
├── hooks/                 # Custom React hooks
│   └── usePokemon.ts      # Main Pokemon data management hook
├── styles/                # SCSS styling
│   ├── abstracts/         # Variables, mixins, functions
│   ├── base/              # Base styles and resets
│   ├── components/        # Component-specific styles
│   └── globals.scss       # Global SCSS imports
├── types/                 # TypeScript type definitions
│   └── pokemon.ts         # Pokemon-related types
└── utils/                 # Utility functions
    └── pokemon-api.ts     # API integration and caching
```

## Architecture Overview

### Data Management

- **usePokemon Hook**: Centralized state management for Pokemon data, filtering, sorting, and pagination
- **Caching System**: Intelligent caching with `pokemonCache` to minimize API calls
- **Batch Loading**: Optimized API calls using `fetchMultiplePokemon` for efficient data loading

### API Integration

- **PokéAPI**: Complete integration with https://pokeapi.co/api/v2/
- **Error Handling**: Robust error handling with custom `ApiError` types
- **Cache Strategy**: Memory-based caching for Pokemon details and species data

### Animation System

- **GSAP Integration**: Custom `useGSAP` hook for animation management
- **WebKit Compatibility**: Special handling for Safari/mobile browsers
- **Animation Types**: Site logo scaling, fade-up effects, grid cascading, modal animations

### Performance Optimizations

- **Complete Data Loading**: All 151 Pokemon loaded with full details at startup
- **Memoization**: React.useMemo and React.useCallback for optimal re-renders
- **Lazy Loading**: Images optimized with Next.js Image component
- **TypeScript**: Full type safety preventing runtime errors

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone https://github.com/dibarradev/pokenext.git
cd pokenext
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Development Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with auto-fix
- `npm run lint:check` - Check linting without fixes
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - TypeScript type checking

## Usage

### Basic Navigation

- Browse through the original 151 Pokemon in grid or list view
- Use pagination to navigate through Pokemon pages (20 per page)
- Click on any Pokemon card to view detailed information

### Search & Filtering

- **Search**: Type Pokemon name or ID number in the search bar
- **Type Filtering**: Select one or multiple Pokemon types to filter results
- **Sorting**: Sort by ID, name, height, or weight in ascending/descending order
- **Clear Filters**: Reset all filters to default state

### View Modes

- **Grid View**: Card-based layout with Pokemon images and basic info
- **List View**: Compact list layout for faster browsing

### Pokemon Details Modal

- Click any Pokemon to open detailed modal with:
  - Complete Pokemon information
  - Type effectiveness
  - Physical characteristics (height/weight)
  - Abilities and base stats
  - Pokemon species description

## API Integration

The application integrates with PokéAPI v2:

- **Base URL**: https://pokeapi.co/api/v2/
- **Endpoints Used**:
  - `/pokemon?limit=151` - Get list of first 151 Pokemon
  - `/pokemon/{id}` - Get detailed Pokemon data
  - `/pokemon-species/{id}` - Get Pokemon species information

### Caching Strategy

- Pokemon list cached as 'pokemon-list-complete'
- Individual Pokemon details cached as 'pokemon-detail-{id}'
- Species data cached as 'pokemon-species-{id}'
- Cache persists during session for optimal performance

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Ensure all types are properly defined

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [PokéAPI](https://pokeapi.co/) for providing comprehensive Pokemon data
- [Next.js](https://nextjs.org/) for the powerful React framework
- [GSAP](https://greensock.com/gsap/) for smooth animations
- [Bootstrap](https://getbootstrap.com/) for responsive design utilities
