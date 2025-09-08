import Image from 'next/image';
import { Pokemon } from '../../types/pokemon';
import {
  formatPokemonId,
  formatPokemonName,
  getPokemonImageUrl,
} from '../../utils/pokemon-api';
import styles from './PokemonCard.module.scss';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: () => void;
  loading?: boolean;
}

export function PokemonCard({
  pokemon,
  onClick,
  loading = false,
}: PokemonCardProps) {
  const imageUrl = pokemon.sprite || getPokemonImageUrl(pokemon.id);
  const primaryType = pokemon.types?.[0]?.type.name;

  const cardClasses = [
    styles.card,
    primaryType && styles[primaryType],
    loading && styles.loading,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      role='button'
      tabIndex={0}
      aria-label={`View details for ${formatPokemonName(pokemon.name)}, Pokemon #${pokemon.id}${pokemon.types ? `, ${pokemon.types.map(t => t.type.name).join(' and ')} type` : ''}`}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Pokemon Image */}
      <div className={styles.imageContainer}>
        <Image
          className={styles.image}
          src={imageUrl}
          alt={formatPokemonName(pokemon.name)}
          width={150}
          height={150}
          priority={pokemon.id <= 10}
        />
        {loading && <div className={styles.imageSkeleton}></div>}
      </div>

      {/* Pokemon Number */}
      <div className={styles.number}>#{formatPokemonId(pokemon.id)}</div>

      {/* Pokemon Name */}
      <h3 className={styles.name}>{formatPokemonName(pokemon.name)}</h3>

      {/* Pokemon Types */}
      {pokemon.types && pokemon.types.length > 0 && (
        <div className={styles.types}>
          {pokemon.types.map(type => (
            <span
              key={type.type.name}
              className={`${styles.type} ${styles[type.type.name]}`}
            >
              {type.type.name}
            </span>
          ))}
        </div>
      )}

      {/* Pokemon Stats (if available) */}
      {pokemon.height && pokemon.weight && (
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Height</span>
            <span className={styles.statValue}>
              {(pokemon.height / 10).toFixed(1)}m
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Weight</span>
            <span className={styles.statValue}>
              {(pokemon.weight / 10).toFixed(1)}kg
            </span>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loading && <div className={styles.loadingOverlay}></div>}
    </div>
  );
}
