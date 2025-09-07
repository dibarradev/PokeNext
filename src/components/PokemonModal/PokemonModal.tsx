'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { animations, useGSAP } from '../../hooks/useGSAP';
import {
  Pokemon,
  PokemonAbility,
  PokemonSpecies,
  PokemonSprites,
  PokemonStat,
  PokemonType,
} from '../../types/pokemon';
import {
  fetchCompletePokemonData,
  fetchPokemonSpecies,
  formatHeight,
  formatPokemonId,
  formatPokemonName,
  formatWeight,
  getEnglishFlavorText,
  getPokemonImageUrl,
} from '../../utils/pokemon-api';
import styles from './PokemonModal.module.scss';

interface PokemonModalProps {
  pokemon: Pokemon | null;
  isOpen: boolean;
  onClose: () => void;
}

interface PokemonCompleteData {
  detail: {
    id: number;
    name: string;
    height: number;
    weight: number;
    sprites: PokemonSprites;
    types: PokemonType[];
    abilities: PokemonAbility[];
    stats: PokemonStat[];
  };
  species: PokemonSpecies;
}

export function PokemonModal({ pokemon, isOpen, onClose }: PokemonModalProps) {
  const [completeData, setCompleteData] = useState<PokemonCompleteData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GSAP animations
  useGSAP();

  // Animate modal when it opens
  useEffect(() => {
    if (isOpen) {
      // Animate modal entrance
      animations.modalBackdrop('#modal-backdrop');
      animations.modalSlideUp('#modal-content');
    }
  }, [isOpen]);

  // Handle animated close
  const handleAnimatedClose = useCallback(() => {
    // Animate exit before closing
    animations.exit.modal('#modal-content');
    animations.exit.backdrop('#modal-backdrop');

    // Close modal after animation
    setTimeout(() => {
      onClose();
    }, 250);
  }, [onClose]);

  // Load complete Pokemon data when modal opens
  useEffect(() => {
    if (isOpen && pokemon) {
      const loadCompleteData = async () => {
        try {
          setLoading(true);
          setError(null);

          // Check if we already have all the data we need
          if (
            pokemon.types &&
            pokemon.height &&
            pokemon.weight &&
            pokemon.abilities &&
            pokemon.stats
          ) {
            // We have the main data, only fetch species if needed for description
            if (!pokemon.species || !pokemon.species.flavor_text_entries) {
              const species = await fetchPokemonSpecies(pokemon.id);
              setCompleteData({
                detail: {
                  id: pokemon.id,
                  name: pokemon.name,
                  height: pokemon.height,
                  weight: pokemon.weight,
                  sprites: { front_default: pokemon.sprite } as PokemonSprites,
                  types: pokemon.types,
                  abilities: pokemon.abilities,
                  stats: pokemon.stats,
                },
                species,
              });
            } else {
              // We have everything, use existing data
              setCompleteData({
                detail: {
                  id: pokemon.id,
                  name: pokemon.name,
                  height: pokemon.height,
                  weight: pokemon.weight,
                  sprites: { front_default: pokemon.sprite } as PokemonSprites,
                  types: pokemon.types,
                  abilities: pokemon.abilities,
                  stats: pokemon.stats,
                },
                species: pokemon.species,
              });
            }
          } else {
            // Fallback: fetch complete data if Pokemon is missing details
            const data = await fetchCompletePokemonData(pokemon.id);
            setCompleteData(data);
          }
        } catch (err) {
          setError('Failed to load Pokemon details');
          console.error('Error loading Pokemon data:', err);
        } finally {
          setLoading(false);
        }
      };

      loadCompleteData();
    }
  }, [isOpen, pokemon]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleAnimatedClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleAnimatedClose]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCompleteData(null);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen || !pokemon) return null;

  const imageUrl = pokemon.sprite || getPokemonImageUrl(pokemon.id);
  const primaryType = pokemon.types?.[0]?.type.name;

  const modalClasses = [styles.modal, primaryType && styles[primaryType]]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      id='modal-backdrop'
      className={styles.backdrop}
      onClick={handleAnimatedClose}
    >
      <div
        id='modal-content'
        className={modalClasses}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.title}>
            <h2 className={styles.name}>{formatPokemonName(pokemon.name)}</h2>
            <span className={styles.number}>
              #{formatPokemonId(pokemon.id)}
            </span>
          </div>
          <button
            className={styles.close}
            onClick={handleAnimatedClose}
            aria-label='Close modal'
          >
            <i className='bi bi-x-lg'></i>
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Image and Basic Info */}
          <div className={styles.hero}>
            <div className={styles.imageContainer}>
              <Image
                className={styles.image}
                src={imageUrl}
                alt={formatPokemonName(pokemon.name)}
                width={200}
                height={200}
                priority
              />
            </div>

            <div className={styles.basicInfo}>
              {/* Types */}
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

              {/* Basic Stats */}
              {pokemon.height && pokemon.weight && (
                <div className={styles.measurements}>
                  <div className={styles.measurement}>
                    <span className={styles.measurementLabel}>Height</span>
                    <span className={styles.measurementValue}>
                      {formatHeight(pokemon.height)}
                    </span>
                  </div>
                  <div className={styles.measurement}>
                    <span className={styles.measurementLabel}>Weight</span>
                    <span className={styles.measurementValue}>
                      {formatWeight(pokemon.weight)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading details...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className={styles.error}>
              <p>{error}</p>
            </div>
          )}

          {/* Complete Data */}
          {completeData && !loading && (
            <div className={styles.details}>
              {/* Description */}
              {completeData.species &&
                completeData.species.flavor_text_entries && (
                  <div className={styles.description}>
                    <h3>Description</h3>
                    <p>{getEnglishFlavorText(completeData.species)}</p>
                  </div>
                )}

              {/* Abilities */}
              {pokemon.abilities && pokemon.abilities.length > 0 && (
                <div className={styles.abilities}>
                  <h3>Abilities</h3>
                  <div className={styles.abilitiesList}>
                    {pokemon.abilities.map(ability => (
                      <span
                        key={ability.ability.name}
                        className={`${styles.ability} ${
                          ability.is_hidden ? styles.hidden : ''
                        }`}
                      >
                        {formatPokemonName(ability.ability.name)}
                        {ability.is_hidden && (
                          <span className={styles.abilityHiddenLabel}>
                            (Hidden)
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              {pokemon.stats && pokemon.stats.length > 0 && (
                <div className={styles.stats}>
                  <h3>Base Stats</h3>
                  <div className={styles.statsList}>
                    {pokemon.stats.map(stat => (
                      <div key={stat.stat.name} className={styles.stat}>
                        <span className={styles.statName}>
                          {formatPokemonName(stat.stat.name.replace('-', ' '))}
                        </span>
                        <div className={styles.statBar}>
                          <div
                            className={styles.statFill}
                            style={{
                              width: `${Math.min(stat.base_stat / 2, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <span className={styles.statValue}>
                          {stat.base_stat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
