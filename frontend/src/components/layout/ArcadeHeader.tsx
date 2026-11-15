import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, Flame, Volume2, VolumeX, Tv, Palette, UploadCloud, Map, Award, BookOpen } from 'lucide-react';
import { useArcadeStore } from '../../stores/useArcadeStore';
import { playClick, playInsertCoin } from '../../utils/audio';

export const ArcadeHeader: React.FC = () => {
  const location = useLocation();
  const { profile, soundEnabled, crtEnabled, theme, toggleSound, toggleCrt, toggleTheme, rechargeShields } = useArcadeStore();

  const navLinks = [
    { to: '/', label: 'DISTRICTS', icon: Map },
    { to: '/upload', label: 'INSERT DECK', icon: UploadCloud },
    { to: '/matrix', label: 'HOLO-CARDS', icon: BookOpen },
    { to: '/highscores', label: 'HALL OF FAME', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-cyber-card/95 backdrop-blur-md border-b-4 border-black shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Arcade Marquee Logo */}
        <Link
          to="/"
          onClick={() => {
            playInsertCoin(soundEnabled);
          }}
          className="flex items-center gap-2 sm:gap-3 group shrink-0"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyber-pink to-cyber-purple border-2 border-black shadow-brutal-pink flex items-center justify-center text-xl sm:text-2xl shrink-0"
          >
            👾
          </motion.div>
          <div className="flex flex-col">
            <span className="font-arcade text-xs sm:text-base tracking-wider text-cyber-cyan text-neon-cyan group-hover:text-cyber-pink transition-colors">
              PM ARCADE
            </span>
            <span className="font-vt text-sm sm:text-base text-cyber-yellow tracking-widest hidden sm:inline-block">
              PRODUCT CITY // 2084
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2 bg-cyber-base p-1.5 rounded-2xl border-2 border-black shadow-brutal-black">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => playClick(soundEnabled)}
                className={`relative px-4 py-2 rounded-xl font-arcade text-[10px] tracking-wider transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-cyber-pink text-white shadow-brutal-pink'
                    : 'text-cyber-muted hover:text-cyber-text hover:bg-cyber-card'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Status Bezel */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {profile && (
            <>
              {/* Shields Heart Bar */}
              <div
                onClick={() => {
                  if (profile.shields < profile.max_shields) {
                    rechargeShields();
                    playInsertCoin(soundEnabled);
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyber-base border-2 border-black shadow-brutal-cyan cursor-pointer"
                title="Cyber-Shields (Click to Recharge)"
              >
                {Array.from({ length: profile.max_shields }).map((_, idx) => (
                  <Shield
                    key={idx}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                      idx < profile.shields
                        ? 'fill-cyber-cyan text-cyber-cyan drop-shadow-[0_0_5px_#00E5FF]'
                        : 'text-gray-700 stroke-1'
                    }`}
                  />
                ))}
              </div>

              {/* Credits XP */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyber-base border-2 border-black shadow-brutal-yellow">
                <Zap className="w-4 h-4 fill-cyber-yellow text-cyber-yellow" />
                <span className="font-arcade text-[10px] text-cyber-yellow">
                  {profile.credits_xp} CR
                </span>
              </div>

              {/* Streak */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyber-base border-2 border-black shadow-brutal-orange text-cyber-orange">
                <Flame className="w-4 h-4 fill-cyber-orange text-cyber-orange animate-bounce-soft" />
                <span className="font-arcade text-[10px]">
                  {profile.streak_days}D
                </span>
              </div>
            </>
          )}

          {/* CRT Screen Toggle */}
          <button
            onClick={() => {
              toggleCrt();
              playClick(soundEnabled);
            }}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border-2 border-black flex items-center justify-center transition-all ${
              crtEnabled
                ? 'bg-cyber-lime text-black shadow-brutal-lime'
                : 'bg-cyber-base text-gray-500 shadow-brutal-black'
            }`}
            title="CRT Scanlines Switch"
          >
            <Tv className="w-4 h-4" />
          </button>

          {/* Audio Toggle */}
          <button
            onClick={() => {
              toggleSound();
              playClick(!soundEnabled);
            }}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border-2 border-black flex items-center justify-center transition-all ${
              soundEnabled
                ? 'bg-cyber-pink text-white shadow-brutal-pink'
                : 'bg-cyber-base text-gray-500 shadow-brutal-black'
            }`}
            title="Arcade 8-Bit Audio"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Toggle (Cyber / Sunset) */}
          <button
            onClick={() => {
              toggleTheme();
              playClick(soundEnabled);
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border-2 border-black bg-cyber-base text-cyber-yellow hover:text-white shadow-brutal-yellow flex items-center justify-center transition-all"
            title={`Switch to ${theme === 'cyber' ? 'Sunset Synthwave' : 'Cyber Grid'} Mode`}
          >
            <Palette className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
