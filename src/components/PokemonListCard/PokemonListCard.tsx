import Image from 'next/image';
import { Pokemon } from '../../types/pokemon';
import {
  formatPokemonId,
  formatPokemonName,
  getPokemonImageUrl,
} from '../../utils/pokemon-api';
import styles from './PokemonListCard.module.scss';

interface PokemonListCardProps {
  pokemon: Pokemon;
  onClick: () => void;
  loading?: boolean;
}

export function PokemonListCard({
  pokemon,
  onClick,
  loading = false,
}: PokemonListCardProps) {
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
    <div className={cardClasses} onClick={onClick}>
      {/* Pokemon Image */}
      <div className={styles.imageContainer}>
        <Image
          className={styles.image}
          src={imageUrl}
          alt={formatPokemonName(pokemon.name)}
          width={80}
          height={80}
          priority={pokemon.id <= 10} // Priority for first page
        />
        {loading && <div className={styles.imageSkeleton}></div>}
      </div>

      {/* Pokemon Info */}
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.number}>#{formatPokemonId(pokemon.id)}</div>
          <h3 className={styles.name}>{formatPokemonName(pokemon.name)}</h3>
        </div>

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

        {/* Pokemon Stats */}
        {pokemon.height && pokemon.weight && (
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statIcon}>
                <i className='bi bi-arrows-vertical'></i>
              </span>
              <span className={styles.statValue}>
                {(pokemon.height / 10).toFixed(1)}m
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statIcon}>
                <i className='bi bi-box-arrow-in-down'></i>
              </span>
              <span className={styles.statValue}>
                {(pokemon.weight / 10).toFixed(1)}kg
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Arrow */}
      <div className={styles.arrow}>
        <i className='bi bi-chevron-right'></i>
      </div>

      {/* Loading overlay */}
      {loading && <div className={styles.loadingOverlay}></div>}
    </div>
  );
}
