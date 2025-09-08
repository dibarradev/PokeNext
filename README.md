# PokeNext

A modern Pokemon application built with Next.js 15, featuring the original 151 Kanto Pokemon with complete data integration, advanced animations, responsive design, and comprehensive SEO optimization.

## Features

- **Complete Pokemon Data**: All 151 original Pokemon with types, heights, weights, abilities, and stats
- **Advanced Search & Filtering**: Search by name/ID, filter by types, sort by various criteria with accessibility support
- **Smooth Animations**: GSAP-powered animations with WebKit compatibility and performance optimization
- **Responsive Design**: Grid/List view modes with mobile-first approach and subtle pattern overlay
- **Modal Details**: Detailed Pokemon information with species descriptions and optimized API calls
- **Performance Optimized**: Intelligent caching system, batch API loading, and LCP optimization
- **SEO & Accessibility**: Complete WCAG 2.1 AA compliance, structured data, and Open Graph meta tags
- **PWA Ready**: Progressive Web App configuration for mobile installation
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 15.5.2 with App Router and Turbopack
- **Runtime**: React 19.1.0 with Server and Client Components
- **Language**: TypeScript with strict type checking
- **Styling**: SCSS with Bootstrap 5.3.8 and custom design system
- **Icons**: Bootstrap Icons 1.13.1
- **Animations**: GSAP 3.13.0 with optimized performance
- **API**: PokéAPI v2 integration with intelligent caching
- **SEO**: JSON-LD structured data and comprehensive meta tags
- **Accessibility**: ARIA labels, semantic HTML, and keyboard navigation

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with meta tags and SEO
│   ├── page.tsx           # Home page component
│   ├── globals.scss       # Global SCSS with pattern overlay
│   └── manifest.json      # PWA configuration
├── components/            # React components with accessibility
│   ├── Footer/            # Footer with disclaimer and Easter egg
│   ├── LoadingSpinner/    # Accessible loading indicators
│   ├── PokemonCard/       # Pokemon cards with ARIA labels
│   ├── PokemonList/       # Main list with semantic structure
│   ├── PokemonModal/      # Modal with focus management
│   ├── Pagination/        # Accessible pagination with ARIA
│   ├── SearchFilters/     # Filters with fieldsets and live regions
│   └── ViewToggle/        # Toggle with pressed states
├── hooks/                 # Custom React hooks
│   └── usePokemon.ts      # Pokemon data management with 151 limit
├── lib/                   # Library functions
│   ├── env.ts             # Environment configuration
│   ├── jsonld.ts          # JSON-LD structured data generation
│   └── metadata.ts        # Meta tags and Open Graph configuration
├── styles/                # SCSS architecture
│   ├── abstracts/         # Variables, mixins, functions
│   ├── base/              # Base styles and accessibility utilities
│   ├── components/        # Component-specific styles
│   └── globals.scss       # Global imports and pattern overlay
├── types/                 # TypeScript definitions
│   └── pokemon.ts         # Pokemon and API response types
└── utils/                 # Utility functions
    └── pokemon-api.ts     # API calls with caching and error handling
```

## Architecture Overview

### Data Management

- **usePokemon Hook**: Centralized state for all 151 Pokemon with complete data loading at startup
- **Smart Caching**: Three-tier cache system (list, details, species) with session persistence
- **Optimized Loading**: Single batch load of all 151 Pokemon eliminates lazy loading complexity
- **Error Handling**: Robust error boundaries with graceful fallbacks

### API Integration

- **PokéAPI v2**: Complete integration focused on original 151 Kanto Pokemon
- **Efficient Batching**: `fetchMultiplePokemon` loads all Pokemon data in optimized batches
- **Reduced API Calls**: Modal optimizations prevent duplicate requests
- **Cache Strategy**: Memory-based caching with environment-specific configurations

### SEO & Performance

- **Structured Data**: JSON-LD schema for Pokemon and website information
- **Meta Tags**: Complete Open Graph, Twitter Cards, and PWA meta tags
- **LCP Optimization**: Critical image preloading and font-display optimization
- **Accessibility**: WCAG 2.1 AA compliance with comprehensive ARIA implementation

### Animation System

- **GSAP Integration**: Custom `useGSAP` hook with WebKit compatibility fixes
- **Performance Focus**: Transform optimizations avoid problematic properties on mobile
- **Smooth Interactions**: Rotation-based animations for better cross-browser support
- **Accessible Animations**: Respect for reduced motion preferences

### Accessibility Features

- **Semantic HTML**: Proper landmarks, headings, and structure
- **ARIA Implementation**: Complete labeling, states, and live regions
- **Keyboard Navigation**: Full keyboard accessibility with visible focus indicators
- **Screen Reader Support**: Descriptive labels and context information
- **Color Contrast**: Optimized contrast ratios for all interactive elements

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

3. Configure environment variables:

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Configuration

Create a `.env.local` file:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production deployment:

```bash
NEXT_PUBLIC_SITE_URL=https://poke-next-generation.vercel.app
```

### Development Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Create optimized production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with auto-fix
- `npm run lint:check` - Check linting without fixes
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - TypeScript type checking

## Usage

### Basic Navigation

- Browse all 151 original Kanto Pokemon in grid or list view
- Use accessible pagination to navigate through Pokemon (10 per page)
- Click or use keyboard to access detailed Pokemon information
- Enjoy subtle pattern overlay and smooth GSAP animations

### Advanced Search & Filtering

- **Search**: Type Pokemon name or ID with autocomplete support
- **Type Filtering**: Multi-select Pokemon types with visual feedback
- **Smart Sorting**: Sort by ID, name, height, or weight with complete data
- **Live Results**: Screen reader announcements for filter changes
- **Reset Options**: Clear individual or all filters

### Accessibility Features

- **Keyboard Navigation**: Tab through all interactive elements
- **Screen Readers**: Complete ARIA labeling and live regions
- **Focus Management**: Visible focus indicators and logical tab order
- **Reduced Motion**: Respects user preferences for animations

### Pokemon Details

- **Rich Information**: Complete stats, abilities, and descriptions
- **Optimized Loading**: No duplicate API calls for cached data
- **Keyboard Accessible**: Full modal navigation support
- **Mobile Optimized**: Touch-friendly interface

## SEO & Performance

### Search Engine Optimization

- **Structured Data**: JSON-LD schema for rich search results
- **Meta Tags**: Complete Open Graph and Twitter Card integration
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Fast Loading**: Optimized images and critical resource preloading

### Performance Optimizations

- **Font Display**: Swap strategy prevents text blocking
- **Image Optimization**: Next.js Image with priority loading
- **Bundle Optimization**: Tree shaking and code splitting
- **Caching Strategy**: Intelligent API response caching

### Progressive Web App

- **Installable**: Add to home screen on mobile devices
- **App-like Experience**: Fullscreen mode without browser chrome
- **Optimized Icons**: Multiple sizes for different devices
- **Offline Ready**: Service worker implementation ready

## API Integration

The application integrates with PokéAPI v2 focusing on the original 151 Pokemon:

- **Base URL**: https://pokeapi.co/api/v2/
- **Primary Endpoints**:
  - `/pokemon?limit=151` - Complete Kanto Pokemon list
  - `/pokemon/{id}` - Detailed Pokemon information
  - `/pokemon-species/{id}` - Species descriptions and lore

### Caching Architecture

- **Complete List Cache**: `pokemon-list-complete` for all 151 Pokemon
- **Individual Caches**: `pokemon-detail-{id}` and `pokemon-species-{id}`
- **Session Persistence**: Cache survives page reloads
- **Smart Invalidation**: Automatic cache management

### Error Handling

- **Graceful Degradation**: App continues functioning with partial data
- **User Feedback**: Clear error messages for failed operations
- **Retry Logic**: Automatic retry for transient failures
- **Type Safety**: TypeScript prevents runtime errors

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards

- **TypeScript**: Strict mode with comprehensive type definitions
- **Accessibility**: WCAG 2.1 AA compliance required
- **Performance**: High standards for Core Web Vitals
- **Testing**: Component and integration tests for new features
- **Documentation**: Update README for significant changes

### Development Guidelines

- Follow semantic commit message conventions
- Ensure all ARIA labels are descriptive and contextual
- Test keyboard navigation thoroughly
- Validate with screen readers when possible
- Maintain responsive design across all viewports

## Legal Disclaimer

This project is created for educational and portfolio demonstration purposes only. Pokemon, Nintendo, Game Freak, and The Pokemon Company are registered trademarks of their respective owners. This project is not affiliated with, endorsed by, or sponsored by Nintendo or any of its affiliates.

All Pokemon data is sourced from the public [PokéAPI](https://pokeapi.co/) service, which provides free access to Pokemon information. Please review PokéAPI's terms of use for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [PokéAPI](https://pokeapi.co/) for comprehensive Pokemon data access
- [Next.js](https://nextjs.org/) for the powerful React framework with App Router
- [GSAP](https://greensock.com/gsap/) for smooth, performant animations
- [Bootstrap](https://getbootstrap.com/) for responsive design utilities
- [Vercel](https://vercel.com/) for seamless deployment and hosting
- The Pokemon community for inspiration and feedback

## Deployment

The application is optimized for deployment on Vercel with automatic environment detection:

- **Production URL**: https://poke-next-generation.vercel.app
- **Automatic Builds**: Connected to GitHub for CI/CD
- **Environment Variables**: Configure `NEXT_PUBLIC_SITE_URL` for your domain
- **Performance**: Optimized for Core Web Vitals and SEO
