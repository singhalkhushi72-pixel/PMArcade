import React from 'react';
import { motion } from 'framer-motion';

export type PixelState = 'idle' | 'cheering' | 'thinking' | 'sad' | 'dancing' | 'alarm';

interface PixelProps {
  state?: PixelState;
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'default' | 'small';
  speechText?: string;
  className?: string;
  onClick?: () => void;
}

const SIZE_MAP: Record<string, string> = {
  sm: 'w-16 h-16',
  small: 'w-16 h-16',
  md: 'w-24 h-24',
  default: 'w-24 h-24',
  lg: 'w-36 h-36',
  hero: 'w-48 h-48 sm:w-56 sm:h-56'
};

export const Pixel: React.FC<PixelProps> = ({
  state = 'idle',
  size = 'md',
  speechText,
  className = '',
  onClick
}) => {
  const pixelVariants: Record<string, any> = {
    idle: {
      y: [0, -8, 0],
      rotate: [0, 1.5, -1.5, 0],
      transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
    },
    cheering: {
      y: [0, -18, 0],
      scale: [1, 1.1, 1],
      transition: { duration: 0.45, repeat: Infinity, ease: 'easeOut' }
    },
    thinking: {
      rotate: [-4, 5, -4],
      y: [0, -4, 0],
      transition: { duration: 2.0, repeat: Infinity, ease: 'easeInOut' }
    },
    sad: {
      y: [0, 6, 0],
      rotate: [0, -3, 0],
      transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
    },
    dancing: {
      y: [0, -14, 0],
      rotate: [-8, 8, -8],
      scale: [1, 1.05, 1],
      transition: { duration: 0.55, repeat: Infinity }
    },
    alarm: {
      x: [-4, 4, -4],
      transition: { duration: 0.2, repeat: Infinity }
    }
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`} onClick={onClick}>
      {/* Arcade Speech Bubble */}
      {speechText && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="z-30 max-w-xs px-3.5 py-2 rounded-xl bg-cyber-card border-2 border-cyber-pink shadow-brutal-pink text-xs font-sans font-bold text-cyber-text relative mb-3 leading-snug"
        >
          <div className="flex items-center gap-1.5 text-[10px] font-arcade text-cyber-pink mb-0.5">
            <span>● PIXEL AI</span>
          </div>
          {speechText}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyber-card border-r-2 border-b-2 border-cyber-pink rotate-45" />
        </motion.div>
      )}

      {/* Mascot Animated Body */}
      <motion.div
        variants={pixelVariants}
        animate={state}
        className={`${SIZE_MAP[size]} relative filter drop-shadow-[0_0_15px_rgba(0,229,255,0.4)] cursor-pointer`}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pixelBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="50%" stopColor="#00B0FF" />
              <stop offset="100%" stopColor="#0B0620" />
            </linearGradient>
            <linearGradient id="antennaGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF2E93" />
              <stop offset="100%" stopColor="#FF8A00" />
            </linearGradient>
          </defs>

          {/* Hologram shadow */}
          <ellipse cx="100" cy="186" rx="48" ry="8" fill="rgba(0, 229, 255, 0.2)" />

          {/* Floating cyber thruster rings */}
          <ellipse cx="100" cy="172" rx="28" ry="5" fill="#FF2E93" opacity="0.8" />
          <ellipse cx="100" cy="178" rx="18" ry="3" fill="#C6FF00" opacity="0.9" />

          {/* Antennas / Robot Ears */}
          <rect x="36" y="50" width="10" height="28" rx="4" fill="#FF2E93" transform="rotate(-18 41 64)" />
          <circle cx="32" cy="46" r="6" fill="#C6FF00" />

          <rect x="154" y="50" width="10" height="28" rx="4" fill="#FF2E93" transform="rotate(18 159 64)" />
          <circle cx="168" cy="46" r="6" fill="#C6FF00" />

          {/* Main Cyber Chassis (Rounded cube / blob) */}
          <rect
            x="38"
            y="48"
            width="124"
            height="116"
            rx="32"
            fill="url(#pixelBody)"
            stroke="#00E5FF"
            strokeWidth="3.5"
          />

          {/* Cyber Visor Screen */}
          <rect
            x="50"
            y="64"
            width="100"
            height="68"
            rx="18"
            fill="#0B0620"
            stroke="#2A1D5C"
            strokeWidth="2.5"
          />

          {/* Visor Scanlines */}
          <line x1="52" y1="78" x2="148" y2="78" stroke="rgba(0, 229, 255, 0.15)" strokeWidth="1.5" />
          <line x1="52" y1="92" x2="148" y2="92" stroke="rgba(0, 229, 255, 0.15)" strokeWidth="1.5" />
          <line x1="52" y1="106" x2="148" y2="106" stroke="rgba(0, 229, 255, 0.15)" strokeWidth="1.5" />
          <line x1="52" y1="120" x2="148" y2="120" stroke="rgba(0, 229, 255, 0.15)" strokeWidth="1.5" />

          {/* Visor Expressions based on state */}
          {state === 'cheering' || state === 'dancing' ? (
            <>
              {/* Star / Arcade ^ ^ eyes */}
              <path d="M 66 98 L 76 86 L 86 98" stroke="#C6FF00" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M 114 98 L 124 86 L 134 98" stroke="#C6FF00" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <rect x="94" y="104" width="12" height="6" rx="2" fill="#FF2E93" />
            </>
          ) : state === 'thinking' ? (
            <>
              {/* Curious looking-up eyes */}
              <circle cx="76" cy="88" r="8" fill="#FFD60A" />
              <circle cx="124" cy="88" r="8" fill="#FFD60A" />
              {/* Dots */}
              <circle cx="92" cy="110" r="2.5" fill="#00E5FF" />
              <circle cx="100" cy="110" r="2.5" fill="#00E5FF" />
              <circle cx="108" cy="110" r="2.5" fill="#00E5FF" />
            </>
          ) : state === 'sad' ? (
            <>
              {/* Downward slant eyes */}
              <path d="M 68 88 L 84 96" stroke="#FF2E93" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 132 88 L 116 96" stroke="#FF2E93" strokeWidth="4" strokeLinecap="round" fill="none" />
              <line x1="92" y1="112" x2="108" y2="112" stroke="#FF2E93" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : state === 'alarm' ? (
            <>
              {/* Warning exclamation / cross eyes */}
              <circle cx="76" cy="94" r="9" fill="#FF2E93" />
              <circle cx="124" cy="94" r="9" fill="#FF2E93" />
              <text x="76" y="99" fontSize="12" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">!</text>
              <text x="124" y="99" fontSize="12" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">!</text>
            </>
          ) : (
            <>
              {/* Default Normal Pixel Eyes */}
              <rect x="68" y="86" width="16" height="18" rx="4" fill="#00E5FF" />
              <rect x="116" y="86" width="16" height="18" rx="4" fill="#00E5FF" />
              <circle cx="78" cy="90" r="3" fill="#FFFFFF" />
              <circle cx="126" cy="90" r="3" fill="#FFFFFF" />
              {/* Small smile */}
              <path d="M 94 108 Q 100 114 106 108" stroke="#C6FF00" strokeWidth="3" strokeLinecap="round" fill="none" />
            </>
          )}

          {/* Side Blasters / Joypad buttons */}
          <circle cx="28" cy="106" r="5" fill="#FFD60A" />
          <circle cx="172" cy="106" r="5" fill="#FF2E93" />

          {/* Top Arcade Joystick Knob */}
          <path d="M 96 48 L 96 34" stroke="#00E5FF" strokeWidth="4" />
          <circle cx="96" cy="30" r="7" fill="url(#antennaGlow)" stroke="#0B0620" strokeWidth="1.5" />
        </svg>
      </motion.div>
    </div>
  );
};
