import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type CatState = 'idle' | 'licking' | 'stretching' | 'happy' | 'sad' | 'expectant' | 'petting' | 'clapping' | 'walking' | 'lying';
export type CatBreed = 'orange' | 'cow' | 'calico' | 'shorthair' | 'ragdoll' | 'devon';

export const Cat = ({ state, breed = 'orange', onClick, className = '', flipX = false }: { state: CatState, breed?: CatBreed, onClick?: () => void, className?: string, flipX?: boolean }) => {
  const headVariants = {
    idle: { rotate: [0, 2, -2, 0], transition: { repeat: Infinity, duration: 4 } },
    licking: { rotate: [0, 15, 0], y: [0, 5, 0], transition: { repeat: Infinity, duration: 0.8 } },
    stretching: { y: 10, rotate: 10 },
    happy: { y: [0, -10, 0], transition: { repeat: Infinity, duration: 0.6 } },
    sad: { y: 10, rotate: 5 },
    expectant: { y: -5, rotate: [0, -5, 5, 0], transition: { repeat: Infinity, duration: 2 } },
    petting: { rotate: [0, -5, 5, 0], transition: { repeat: Infinity, duration: 1 } },
    clapping: { rotate: [0, -5, 5, 0], y: [0, -5, 0], transition: { repeat: Infinity, duration: 0.4 } },
    walking: { y: [0, -2, 0], transition: { repeat: Infinity, duration: 0.3 } },
    lying: { y: 20, rotate: -5 }
  };

  const eyeVariants = {
    idle: { scaleY: [1, 1, 0.1, 1, 1], transition: { repeat: Infinity, duration: 3, times: [0, 0.45, 0.5, 0.55, 1] } },
    licking: { scaleY: 0.1 },
    stretching: { scaleY: 0.1 },
    happy: { scaleY: 0.2 },
    sad: { scaleY: 0.5, rotate: 10 },
    expectant: { scaleY: 1.2 },
    petting: { scaleY: 0.1 },
    clapping: { scaleY: [1, 0.2, 1], transition: { repeat: Infinity, duration: 0.6 } },
    walking: { scaleY: [1, 1, 0.1, 1, 1], transition: { repeat: Infinity, duration: 2, times: [0, 0.45, 0.5, 0.55, 1] } },
    lying: { scaleY: 0.1 }
  };

  const tailVariants = {
    idle: { rotate: [0, 10, -10, 0], transition: { repeat: Infinity, duration: 2 } },
    licking: { rotate: [20, 30, 20], transition: { repeat: Infinity, duration: 1 } },
    stretching: { rotate: -30 },
    happy: { rotate: [0, 20, -20, 0], transition: { repeat: Infinity, duration: 0.5 } },
    sad: { rotate: 40 },
    expectant: { rotate: [0, 15, 0], transition: { repeat: Infinity, duration: 1 } },
    petting: { rotate: [0, 20, 0], transition: { repeat: Infinity, duration: 0.8 } },
    clapping: { rotate: [0, 30, 0], transition: { repeat: Infinity, duration: 0.4 } },
    walking: { rotate: [10, -10, 10], transition: { repeat: Infinity, duration: 0.6 } },
    lying: { rotate: 30 }
  };

  const pawLeftVariants = {
    idle: { x: 0, y: 0 },
    licking: { y: [-10, -20, -10], x: [0, -10, 0], transition: { repeat: Infinity, duration: 0.8 } },
    stretching: { x: 20, y: 5 },
    happy: { y: [-5, 5, -5], transition: { repeat: Infinity, duration: 0.3 } },
    sad: { x: 0, y: 0 },
    expectant: { x: 0, y: 0 },
    petting: { x: 0, y: 0 },
    clapping: { x: [0, 15, 0], y: [-5, -20, -5], transition: { repeat: Infinity, duration: 0.4 } },
    walking: { x: [0, 10, -5, 0], y: [0, -5, 0, 0], transition: { repeat: Infinity, duration: 0.6 } },
    lying: { x: 20, y: -5 }
  };

  const pawRightVariants = {
    idle: { x: 0, y: 0 },
    licking: { x: 0, y: 0 },
    stretching: { x: 20, y: 5 },
    happy: { y: [-5, 5, -5], transition: { repeat: Infinity, duration: 0.3, delay: 0.15 } },
    sad: { x: 0, y: 0 },
    expectant: { x: 0, y: 0 },
    petting: { x: 0, y: 0 },
    clapping: { x: [0, -15, 0], y: [-5, -20, -5], transition: { repeat: Infinity, duration: 0.4 } },
    walking: { x: [0, -5, 10, 0], y: [0, 0, -5, 0], transition: { repeat: Infinity, duration: 0.6, delay: 0.3 } },
    lying: { x: -10, y: 5 }
  };

  // Define breed-specific colors and markings
  const getBreedStyles = () => {
    switch (breed) {
      case 'cow': // Black and white
        return { base: '#ffffff', marking1: '#1f2937', marking2: '#1f2937', outline: '#9ca3af', eyeColor: '#475569' };
      case 'calico': // White, orange, black
        return { base: '#ffffff', marking1: '#f97316', marking2: '#1f2937', outline: '#9ca3af', eyeColor: '#475569' };
      case 'shorthair': // Silver with dark grey stripes
        return { base: '#e5e7eb', marking1: '#6b7280', marking2: '#4b5563', outline: '#9ca3af', eyeColor: '#059669' };
      case 'ragdoll': // Cream with dark face/ears and blue eyes
        return { base: '#fef3c7', marking1: '#4b5563', marking2: '#fef3c7', outline: '#d1d5db', eyeColor: '#3b82f6' };
      case 'devon': // Peach colored, curly feeling (represented by colors)
        return { base: '#ffedd5', marking1: '#fdba74', marking2: '#fdba74', outline: '#fbd38d', eyeColor: '#475569' };
      case 'orange':
      default:
        return { base: '#FCD34D', marking1: '#F59E0B', marking2: '#F59E0B', outline: '#F59E0B', eyeColor: '#475569' };
    }
  };

  const styles = getBreedStyles();

  return (
    <motion.div
      className={`relative w-48 h-48 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible" style={flipX ? { transform: 'scaleX(-1)' } : {}}>
        {/* Tail */}
        <motion.path
          d="M 140 140 Q 180 140 170 100"
          fill="none"
          stroke={styles.marking1}
          strokeWidth="15"
          strokeLinecap="round"
          variants={tailVariants}
          animate={state}
          style={{ transformOrigin: '140px 140px' }}
        />

        {/* Body */}
        <motion.ellipse
          cx="100" cy="130" rx="45" ry="40"
          fill={styles.base}
          stroke={styles.outline}
          strokeWidth="2"
        />

        {/* Body Markings */}
        {breed === 'cow' && (
          <path d="M 80 110 Q 100 140 120 120 Q 130 100 100 90 Z" fill={styles.marking1} opacity="0.9" />
        )}
        {breed === 'calico' && (
          <>
            <path d="M 70 120 Q 90 140 100 110 Z" fill={styles.marking1} opacity="0.9" />
            <path d="M 110 130 Q 130 150 140 120 Z" fill={styles.marking2} opacity="0.9" />
          </>
        )}
        {breed === 'shorthair' && (
          <>
            <path d="M 70 110 L 80 150 M 90 110 L 100 150 M 110 110 L 120 150 M 130 110 L 140 150" stroke={styles.marking1} strokeWidth="4" strokeLinecap="round" opacity="0.5" />
          </>
        )}

        {/* Paws */}
        <motion.circle cx="70" cy="165" r="10" fill={breed === 'ragdoll' ? styles.base : styles.marking1} stroke={styles.outline} strokeWidth="1" variants={pawLeftVariants} animate={state} />
        <motion.circle cx="130" cy="165" r="10" fill={breed === 'ragdoll' ? styles.base : styles.marking1} stroke={styles.outline} strokeWidth="1" variants={pawRightVariants} animate={state} />

        {/* Head Group */}
        <motion.g variants={headVariants} animate={state} style={{ transformOrigin: '100px 100px' }}>
          {/* Ears */}
          {breed === 'devon' ? (
            <>
              <polygon points="65,60 30,0 90,45" fill={styles.marking1} />
              <polygon points="135,60 170,0 110,45" fill={styles.marking1} />
            </>
          ) : (
            <>
              <polygon points="65,60 55,20 90,45" fill={styles.marking1} stroke={styles.outline} strokeWidth="1" />
              <polygon points="135,60 145,20 110,45" fill={styles.marking1} stroke={styles.outline} strokeWidth="1" />
            </>
          )}

          {/* Face */}
          <circle cx="100" cy="75" r="40" fill={styles.base} stroke={styles.outline} strokeWidth="2" />

          {/* Face Markings */}
          {breed === 'ragdoll' && (
            <path d="M 60 75 Q 100 90 140 75 Q 120 40 100 45 Q 80 40 60 75 Z" fill={styles.marking1} opacity="0.9" />
          )}
          {breed === 'cow' && (
            <path d="M 60 50 Q 80 80 100 60 Q 120 40 140 50 L 120 35 L 80 35 Z" fill={styles.marking1} />
          )}
          {breed === 'calico' && (
            <>
              <path d="M 60 60 Q 80 80 95 60 Z" fill={styles.marking1} />
              <path d="M 140 60 Q 120 80 105 60 Z" fill={styles.marking2} />
            </>
          )}
          {breed === 'shorthair' && (
            <path d="M 100 45 L 100 55 M 90 45 L 95 55 M 110 45 L 105 55" stroke={styles.marking2} strokeWidth="3" strokeLinecap="round" />
          )}

          {/* Eyes */}
          <motion.g variants={eyeVariants} animate={state} style={{ transformOrigin: '100px 75px' }}>
            {state === 'happy' || state === 'petting' || state === 'clapping' ? (
              <>
                <path d="M 80 70 Q 85 65 90 70" fill="none" stroke={styles.eyeColor} strokeWidth="3" strokeLinecap="round" />
                <path d="M 110 70 Q 115 65 120 70" fill="none" stroke={styles.eyeColor} strokeWidth="3" strokeLinecap="round" />
              </>
            ) : state === 'sad' ? (
              <>
                <path d="M 80 65 Q 85 70 90 65" fill="none" stroke={styles.eyeColor} strokeWidth="3" strokeLinecap="round" />
                <path d="M 110 65 Q 115 70 120 65" fill="none" stroke={styles.eyeColor} strokeWidth="3" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="85" cy="70" r="5" fill={styles.eyeColor} />
                <circle cx="115" cy="70" r="5" fill={styles.eyeColor} />
              </>
            )}
          </motion.g>

          {/* Nose & Mouth */}
          <path d="M 95 80 Q 100 85 105 80" fill="none" stroke={breed === 'ragdoll' ? '#ffffff' : '#475569'} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          {state === 'happy' || state === 'expectant' || state === 'clapping' ? (
            <path d="M 95 85 Q 100 95 105 85" fill="#FCA5A5" stroke={breed === 'ragdoll' ? '#e2e8f0' : '#475569'} strokeWidth="2" opacity="0.8" />
          ) : state === 'sad' ? (
            <path d="M 95 88 Q 100 83 105 88" fill="none" stroke={breed === 'ragdoll' ? '#ffffff' : '#475569'} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          ) : (
            <path d="M 95 85 Q 100 90 105 85" fill="none" stroke={breed === 'ragdoll' ? '#ffffff' : '#475569'} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          )}

          {/* Whiskers */}
          <path d="M 65 75 L 45 70 M 65 80 L 45 80 M 65 85 L 45 90" stroke={breed === 'ragdoll' ? '#ffffff' : '#475569'} strokeWidth="1.5" strokeLinecap="round" opacity={breed === 'ragdoll' ? 0.9 : 0.4} />
          <path d="M 135 75 L 155 70 M 135 80 L 155 80 M 135 85 L 155 90" stroke={breed === 'ragdoll' ? '#ffffff' : '#475569'} strokeWidth="1.5" strokeLinecap="round" opacity={breed === 'ragdoll' ? 0.9 : 0.4} />
        </motion.g>

        {/* Hearts for petting */}
        <AnimatePresence>
          {state === 'petting' && (
            <>
              <motion.path
                initial={{ opacity: 0, y: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], y: -50, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                d="M 150 40 A 10 10 0 0 0 170 40 A 10 10 0 0 0 190 40 Q 190 60 170 80 Q 150 60 150 40"
                fill="#FCA5A5"
              />
              <motion.path
                initial={{ opacity: 0, y: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], y: -40, scale: 0.8, x: -20 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                d="M 30 50 A 10 10 0 0 0 50 50 A 10 10 0 0 0 70 50 Q 70 70 50 90 Q 30 70 30 50"
                fill="#FCA5A5"
              />
            </>
          )}
        </AnimatePresence>
      </svg>
    </motion.div>
  );
};
