'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from './Footer.module.scss';

export function Footer() {
  const [clickCount, setClickCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePokeballClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    // Clear previous timeout if it exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // If it's the third click, redirect
    if (newCount === 3) {
      window.open('https://gravatar.com/agile3fc082a58b', '_blank');
      setClickCount(0); // Reset counter
      return;
    }

    // Set up 5 seconds timeout to reset
    timeoutRef.current = setTimeout(() => {
      setClickCount(0);
    }, 5000);
  };

  // Handle keyboard interaction for pokeball
  const handlePokeballKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePokeballClick();
    }
  };

  // Cleanup the timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <footer className={styles.footer} role='contentinfo'>
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <div className={styles.footerContent}>
              {/* Decorative Pokeball with Easter Egg */}
              <div className={styles.pokeballContainer}>
                <Image
                  src='/img/pokeball-loader.webp'
                  alt='Decorative Pokeball'
                  width={24}
                  height={24}
                  className={styles.pokeball}
                  onClick={handlePokeballClick}
                  onKeyDown={handlePokeballKeyDown}
                  role='button'
                  tabIndex={0}
                  aria-label={`Decorative Pokeball (clicked ${clickCount}/3 times)`}
                  style={{
                    cursor: 'pointer',
                    transform: `rotate(${clickCount * 180}deg)`,
                  }}
                />
              </div>

              {/* Tech Stack Information */}
              <p className={styles.techStack}>
                Built with Next.js, React, PokeAPI, GSAP, Bootstrap… and powered
                by lots of pizza.
              </p>

              {/* Disclaimer */}
              <div className={styles.disclaimer} role='note'>
                <p>
                  This is a portfolio project created for educational and
                  demonstration purposes. Pokémon and Pokémon character names
                  are trademarks of Nintendo, Game Freak, and The Pokémon
                  Company. All Pokémon data is provided by{' '}
                  <a
                    href='https://pokeapi.co/'
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='Visit PokéAPI website (opens in new tab)'
                  >
                    PokéAPI
                  </a>{' '}
                  under their terms of use. This project is not affiliated with
                  or endorsed by Nintendo or The Pokémon Company.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
