import React from 'react';
import { useArcadeStore } from '../../stores/useArcadeStore';

export const CrtOverlay: React.FC = () => {
  const crtEnabled = useArcadeStore((s) => s.crtEnabled);

  if (!crtEnabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden crt-overlay opacity-90">
      {/* Subtle sweeping scanline beam */}
      <div className="w-full h-12 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-scanline" />
    </div>
  );
};
