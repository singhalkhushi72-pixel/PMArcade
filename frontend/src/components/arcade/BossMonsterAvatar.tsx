import React from 'react';
import { motion } from 'framer-motion';

interface BossAvatarProps {
  isHit?: boolean;
  hpPercent: number;
  bossName?: string;
  monsterName?: string;
  className?: string;
}

export const BossMonsterAvatar: React.FC<BossAvatarProps> = ({
  isHit = false,
  hpPercent,
  bossName = 'THE SCOPE CREEP',
  monsterName,
  className = ''
}) => {
  const activeName = monsterName || bossName;
  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Monster Animated Container */}
      <motion.div
        animate={
          isHit
            ? {
                x: [-12, 12, -8, 8, 0],
                filter: [
                  'brightness(2.2) drop-shadow(0 0 35px #FF2E93)',
                  'brightness(1) drop-shadow(0 0 15px #FF2E93)'
                ],
              }
            : {
                y: [0, -10, 0],
                scale: [1, 1.03, 1],
              }
        }
        transition={isHit ? { duration: 0.35 } : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        className="w-48 h-48 sm:w-60 sm:h-60 relative"
      >
        <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="scopeBlob" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF2E93" />
              <stop offset="60%" stopColor="#9B51E0" />
              <stop offset="100%" stopColor="#0B0620" />
            </radialGradient>
            <filter id="neonGlow">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#FF2E93" />
            </filter>
          </defs>

          {/* Shadow Aura */}
          <ellipse cx="120" cy="216" rx="75" ry="14" fill="rgba(255, 46, 147, 0.25)" />

          {/* Tentacles / Sprouting Feature Creep Arms */}
          <path d="M 50 160 Q 20 190 10 170 Q 25 140 60 145 Z" fill="#9B51E0" stroke="#FF2E93" strokeWidth="2.5" />
          <path d="M 190 160 Q 220 190 230 170 Q 215 140 180 145 Z" fill="#9B51E0" stroke="#FF2E93" strokeWidth="2.5" />
          <path d="M 65 70 Q 30 40 20 60 Q 35 90 75 90 Z" fill="#9B51E0" stroke="#00E5FF" strokeWidth="2.5" />
          <path d="M 175 70 Q 210 40 220 60 Q 205 90 165 90 Z" fill="#9B51E0" stroke="#00E5FF" strokeWidth="2.5" />

          {/* Main Scope Blob Body */}
          <path
            d="M 120 40 
               C 170 35, 205 75, 200 125 
               C 195 180, 165 205, 120 205 
               C 75 205, 45 180, 40 125 
               C 35 75, 70 35, 120 40 Z"
            fill="url(#scopeBlob)"
            stroke={isHit ? '#FFFFFF' : '#FF2E93'}
            strokeWidth="4"
            filter="url(#neonGlow)"
          />

          {/* Multiple Glowing Threat Eyes */}
          {/* Main Giant Cyber Eye */}
          <circle cx="120" cy="115" r="26" fill="#0B0620" stroke="#C6FF00" strokeWidth="3" />
          <circle cx="120" cy="115" r="14" fill="#FF8A00" />
          <circle cx="124" cy="111" r="5" fill="#FFFFFF" />

          {/* Eye 2 (Left) */}
          <circle cx="85" cy="90" r="14" fill="#0B0620" stroke="#00E5FF" strokeWidth="2.5" />
          <circle cx="85" cy="90" r="7" fill="#C6FF00" />
          <circle cx="87" cy="88" r="2.5" fill="#FFFFFF" />

          {/* Eye 3 (Right) */}
          <circle cx="155" cy="90" r="14" fill="#0B0620" stroke="#00E5FF" strokeWidth="2.5" />
          <circle cx="155" cy="90" r="7" fill="#C6FF00" />
          <circle cx="157" cy="88" r="2.5" fill="#FFFFFF" />

          {/* Eye 4 (Forehead eye) */}
          <circle cx="120" cy="65" r="10" fill="#0B0620" stroke="#FF2E93" strokeWidth="2" />
          <circle cx="120" cy="65" r="4.5" fill="#FFD60A" />

          {/* Sharp Cyber Teeth / Grin */}
          <path
            d="M 85 160 Q 120 185 155 160"
            stroke="#C6FF00"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <polygon points="100,165 106,174 112,165" fill="#FFFFFF" />
          <polygon points="116,167 122,176 128,167" fill="#FFFFFF" />
          <polygon points="132,165 138,174 144,165" fill="#FFFFFF" />
        </svg>
      </motion.div>

      {/* Floating Monster Name Banner */}
      <div className="mt-2 text-center">
        <span className="font-arcade text-xs sm:text-sm text-cyber-pink tracking-widest text-neon-pink">
          {bossName}
        </span>
      </div>
    </div>
  );
};
