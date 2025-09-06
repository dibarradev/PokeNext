'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function useGSAP() {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Create main timeline
    timelineRef.current = gsap.timeline({ paused: true });

    return () => {
      // Cleanup
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return {
    timeline: timelineRef.current,
    gsap,
    ScrollTrigger,
    // Utility to reset elements to their initial animation state
    resetToInitialState: (elements: string | NodeList | Element[]) => {
      gsap.set(elements, { opacity: 0, y: 20, clearProps: 'transform' });
    },
    // Utility to ensure elements are visible
    ensureVisible: (elements: string | NodeList | Element[]) => {
      gsap.set(elements, {
        opacity: 1,
        y: 0,
        scale: 1,
        clearProps: 'transform',
      });
    },
  };
}

// Animation utilities
export const animations = {
  // Logo scale animation - optimized for performance
  siteLogo: (element: string | Element) => {
    return gsap.fromTo(
      element,
      {
        scale: 0.8,
        opacity: 0,
        transformOrigin: 'center center',
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.1,
      }
    );
  },

  // Fade up animation - optimized
  fadeUp: (element: string | Element, delay: number = 0) => {
    return gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 15,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        delay,
      }
    );
  },

  // Grid items cascade animation - performance optimized
  gridCascade: (
    elements: string | NodeList | Element[],
    startDelay: number = 0
  ) => {
    return gsap.fromTo(
      elements,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        stagger: {
          amount: 0.4,
          from: 'start',
          grid: 'auto',
        },
        delay: startDelay,
      }
    );
  },

  // Modal slide up animation - smoother and faster
  modalSlideUp: (element: string | Element) => {
    return gsap.fromTo(
      element,
      {
        opacity: 0,
        y: '50%',
        scale: 0.95,
      },
      {
        opacity: 1,
        y: '0%',
        scale: 1,
        duration: 0.3,
        ease: 'power3.out',
      }
    );
  },

  // Modal backdrop fade
  modalBackdrop: (element: string | Element) => {
    return gsap.fromTo(
      element,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      }
    );
  },

  // No results found block animation
  noFoundBlock: (element: string | Element) => {
    return gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 30,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.7)',
        delay: 0.2,
      }
    );
  },

  // Exit animations
  exit: {
    modal: (element: string | Element) => {
      return gsap.to(element, {
        opacity: 0,
        y: '50%',
        scale: 0.9,
        duration: 0.25,
        ease: 'power3.in',
      });
    },
    backdrop: (element: string | Element) => {
      return gsap.to(element, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
      });
    },
  },
};
