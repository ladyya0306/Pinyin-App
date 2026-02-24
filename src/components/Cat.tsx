import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type CatState = 'idle' | 'licking' | 'stretching' | 'happy' | 'sad' | 'expectant' | 'petting';

export const Cat = ({ state, onClick, className = '' }: { state: CatState, onClick?: () => void, className?: string }) => {
  const headVariants = {
    idle: { rotate: [0, 2, -2, 0], transition: { repeat: Infinity, duration: 4 } },
    licking: { rotate: [0, 15, 0], y: [0, 5, 0], transition: { repeat: Infinity, duration: 0.8 } },
    stretching: { y: 10, rotate: 10 },
    happy: { y: [0, -10, 0], transition: { repeat: Infinity, duration: 0.6 } },
    sad: { y: 10, rotate: 5 },
    expectant: { y: -5, rotate: [0, -5, 5, 0], transition: { repeat: Infinity, duration: 2 } },
    petting: { rotate: [0, -5, 5, 0], transition: { repeat: Infinity, duration: 1 } }
  };

  const eyeVariants = {
    idle: { scaleY: [1, 1, 0.1, 1, 1], transition: { repeat: Infinity, duration: 3, times: [0, 0.45, 0.5, 0.55, 1] } },
    licking: { scaleY: 0.1 },
    stretching: { scaleY: 0.1 },
    happy: { scaleY: 0.2 },
    sad: { scaleY: 0.5, rotate: 10 },
    expectant: { scaleY: 1.2 },
    petting: { scaleY: 0.1 }
  };

  const tailVariants = {
    idle: { rotate: [0, 10, -10, 0], transition: { repeat: Infinity, duration: 2 } },
    licking: { rotate: [20, 30, 20], transition: { repeat: Infinity, duration: 1 } },
    stretching: { rotate: -30 },
    happy: { rotate: [0, 20, -20, 0], transition: { repeat: Infinity, duration: 0.5 } },
    sad: { rotate: 40 },
    expectant: { rotate: [0, 15, 0], transition: { repeat: Infinity, duration: 1 } },
    petting: { rotate: [0, 20, 0], transition: { repeat: Infinity, duration: 0.8 } }
  };

  const pawVariants = {
    idle: { y: 0 },
    licking: { y: [-10, -20, -10], x: [0, -10, 0], transition: { repeat: Infinity, duration: 0.8 } },
    stretching: { x: 20, y: 5 },
    happy: { y: [-5, 5, -5], transition: { repeat: Infinity, duration: 0.3 } },
    sad: { y: 0 },
    expectant: { y: 0 },
    petting: { y: 0 }
  };

  return (
    <motion.div 
      className={`relative w-48 h-48 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
        {/* Tail */}
        <motion.path
          d="M 140 140 Q 180 140 170 100"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="15"
          strokeLinecap="round"
          variants={tailVariants}
          animate={state}
          style={{ transformOrigin: '140px 140px' }}
        />
        
        {/* Body */}
        <motion.ellipse
          cx="100" cy="130" rx="45" ry="40"
          fill="#FCD34D"
        />
        
        {/* Paws */}
        <motion.circle cx="70" cy="165" r="10" fill="#F59E0B" variants={pawVariants} animate={state} />
        <motion.circle cx="130" cy="165" r="10" fill="#F59E0B" />

        {/* Head Group */}
        <motion.g variants={headVariants} animate={state} style={{ transformOrigin: '100px 100px' }}>
          {/* Ears */}
          <polygon points="65,60 55,20 90,45" fill="#F59E0B" />
          <polygon points="135,60 145,20 110,45" fill="#F59E0B" />
          
          {/* Face */}
          <circle cx="100" cy="75" r="40" fill="#FCD34D" />
          
          {/* Eyes */}
          <motion.g variants={eyeVariants} animate={state} style={{ transformOrigin: '100px 75px' }}>
            {state === 'happy' || state === 'petting' ? (
              <>
                <path d="M 80 70 Q 85 65 90 70" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
                <path d="M 110 70 Q 115 65 120 70" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : state === 'sad' ? (
              <>
                <path d="M 80 65 Q 85 70 90 65" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
                <path d="M 110 65 Q 115 70 120 65" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="85" cy="70" r="5" fill="#475569" />
                <circle cx="115" cy="70" r="5" fill="#475569" />
              </>
            )}
          </motion.g>
          
          {/* Nose & Mouth */}
          <path d="M 95 80 Q 100 85 105 80" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          {state === 'happy' || state === 'expectant' ? (
            <path d="M 95 85 Q 100 95 105 85" fill="#FCA5A5" stroke="#475569" strokeWidth="2" />
          ) : state === 'sad' ? (
            <path d="M 95 88 Q 100 83 105 88" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path d="M 95 85 Q 100 90 105 85" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          )}
          
          {/* Whiskers */}
          <path d="M 65 75 L 45 70 M 65 80 L 45 80 M 65 85 L 45 90" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 135 75 L 155 70 M 135 80 L 155 80 M 135 85 L 155 90" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
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
