import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, UploadCloud, BookOpen, Award } from 'lucide-react';
import { useArcadeStore } from '../../stores/useArcadeStore';
import { playClick } from '../../utils/audio';

export const ArcadeBottomNav: React.FC = () => {
  const location = useLocation();
  const soundEnabled = useArcadeStore((s) => s.soundEnabled);

  const links = [
    { to: '/', label: 'DISTRICTS', icon: Map },
    { to: '/upload', label: 'INSERT DECK', icon: UploadCloud },
    { to: '/matrix', label: 'CARDS', icon: BookOpen },
    { to: '/highscores', label: 'FAME', icon: Award },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-cyber-card/95 backdrop-blur-md border-t-4 border-black px-2 py-1 shadow-2xl">
      <div className="flex items-center justify-around">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => playClick(soundEnabled)}
              className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-cyber-pink font-arcade'
                  : 'text-cyber-muted font-sans font-bold'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isActive ? 'bg-cyber-base border-2 border-cyber-pink shadow-brutal-pink' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[9px] mt-1 tracking-wider">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
