import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CombatAlert {
  id: string;
  text: string;
  type: 'damage' | 'crit' | 'combo' | 'shield';
  x?: number;
  y?: number;
}

interface FloatingCombatProps {
  alerts: CombatAlert[];
}

export const FloatingCombatText: React.FC<FloatingCombatProps> = ({ alerts }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {alerts.map((a) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, scale: 0.5, y: a.y || 250 }}
            animate={{ opacity: 1, scale: [0.8, 1.3, 1], y: (a.y || 250) - 70 }}
            exit={{ opacity: 0, scale: 0.8, y: (a.y || 250) - 120 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`absolute font-arcade font-extrabold text-center drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] ${
              a.type === 'crit'
                ? 'text-cyber-yellow text-xl sm:text-2xl text-neon-yellow'
                : a.type === 'combo'
                ? 'text-cyber-lime text-lg sm:text-xl text-neon-lime'
                : a.type === 'damage'
                ? 'text-cyber-pink text-lg text-neon-pink'
                : 'text-cyber-cyan text-sm'
            }`}
            style={{ left: a.x ? `${a.x}px` : '50%', transform: 'translateX(-50%)' }}
          >
            {a.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
