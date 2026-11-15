import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Plus, Trash2, Swords, Sparkles, Layers, Shield, Zap } from 'lucide-react';
import { api } from '../services/api';
import { District } from '../types';
import { Pixel } from '../components/mascot/Pixel';
import { useArcadeStore } from '../stores/useArcadeStore';
import { playClick, playInsertCoin } from '../utils/audio';

export const DistrictMap: React.FC = () => {
  const navigate = useNavigate();
  const { profile, soundEnabled } = useArcadeStore();
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDistricts();
  }, []);

  const loadDistricts = async () => {
    try {
      setLoading(true);
      const data = await api.getDistricts();
      setDistricts(data);
    } catch (err) {
      console.error('Failed to load districts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDistrict = async (id: string, title: string) => {
    if (confirm(`Decommission arcade cabinet for "${title}"?`)) {
      try {
        await api.deleteDistrict(id);
        loadDistricts();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 pb-28">
      {/* City Marquee Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-cyber-card border-4 border-black p-6 sm:p-10 shadow-brutal-cyan flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-3 z-10 text-center md:text-left max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyber-base border-2 border-cyber-pink text-xs font-arcade text-cyber-pink">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PRODUCT CITY // OVERWORLD</span>
          </div>

          <h1 className="font-arcade text-xl sm:text-3xl font-extrabold text-cyber-text text-neon-cyan leading-tight tracking-wider">
            WELCOME TO PRODUCT CITY
          </h1>

          <p className="font-sans text-xs sm:text-sm text-cyber-muted font-medium leading-relaxed">
            Every uploaded lecture deck becomes an interactive arcade district. Conquer syllabus nodes, unlock high combos, and slay the District Boss!
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button
              onClick={() => {
                playInsertCoin(soundEnabled);
                navigate('/upload');
              }}
              className="px-6 py-3.5 rounded-xl bg-cyber-pink hover:bg-pink-600 text-white font-arcade text-xs border-2 border-black shadow-brutal-pink btn-arcade flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>INSERT NEW DECK</span>
            </button>

            <button
              onClick={() => {
                playClick(soundEnabled);
                navigate('/matrix');
              }}
              className="px-5 py-3.5 rounded-xl bg-cyber-base hover:bg-cyber-card text-cyber-lime font-arcade text-xs border-2 border-black shadow-brutal-lime btn-arcade flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span>HOLO-CARDS MATRIX</span>
            </button>
          </div>
        </div>

        {/* Pixel Mascot Avatar */}
        <div className="shrink-0 z-10">
          <Pixel
            size="hero"
            state={profile && profile.streak_days > 1 ? 'cheering' : 'idle'}
            speechText={
              profile && profile.streak_days > 1
                ? `🔥 ${profile.streak_days}D STREAK! You're dominating Product City!`
                : "Select an arcade cabinet below to begin battle!"
            }
          />
        </div>

        {/* Decorative Neon Grid Lines */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-cyber-cyan/10 blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-cyber-pink/10 blur-xl pointer-events-none" />
      </motion.div>

      {/* Arcade District Cabinets Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-cyber-pink animate-ping rounded-full" />
            <h2 className="font-arcade text-sm sm:text-base text-cyber-text tracking-wider">
              ACTIVE ARCADE DISTRICTS
            </h2>
          </div>
          <span className="font-vt text-lg text-cyber-lime tracking-widest">
            {districts.length} DISTRICTS ONLINE
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center font-arcade text-xs text-cyber-muted animate-pulse">
            LOADING DISTRICT MATRIX...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {districts.map((district, idx) => {
              const levels = district.levels || [];
              const completedCount = levels.filter((l) => l.completed).length;
              const percent = levels.length > 0 ? Math.round((completedCount / levels.length) * 100) : 0;

              return (
                <motion.div
                  key={district.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="relative rounded-3xl bg-cyber-card border-4 border-black p-6 shadow-brutal-black hover:shadow-brutal-cyan transition-all flex flex-col justify-between overflow-hidden group"
                  style={{ borderColor: district.arcade_cabinet_color || '#00E5FF' }}
                >
                  {/* Glowing Top Cabinet Marquee */}
                  <div
                    className="absolute top-0 left-0 right-0 h-2.5"
                    style={{ backgroundColor: district.arcade_cabinet_color || '#00E5FF' }}
                  />

                  <div className="space-y-4 pt-1">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className="font-arcade text-[9px] uppercase px-2.5 py-1 rounded-md border-2 border-black"
                        style={{
                          backgroundColor: district.is_demo ? '#C6FF00' : '#FF2E93',
                          color: '#000',
                        }}
                      >
                        {district.is_demo ? 'STARTER SECTOR' : 'CUSTOM DECK'}
                      </span>

                      {!district.is_demo && (
                        <button
                          onClick={() => handleDeleteDistrict(district.id, district.title)}
                          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-cyber-pink transition-all p-1"
                          title="Decommission District"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div>
                      <h3 className="font-arcade text-xs sm:text-sm text-cyber-text leading-snug line-clamp-2">
                        {district.title}
                      </h3>
                      <p className="font-sans text-xs text-cyber-muted mt-1 line-clamp-1">
                        {district.tagline}
                      </p>
                    </div>

                    {/* Boss Threat Warning Indicator */}
                    {district.boss && (
                      <div className="p-2.5 rounded-xl bg-cyber-base border-2 border-black flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Swords className="w-4 h-4 text-cyber-pink animate-bounce-soft" />
                          <span className="font-arcade text-[9px] text-cyber-pink">
                            BOSS: {district.boss.name}
                          </span>
                        </div>
                        <span className="font-vt text-sm text-cyber-yellow">
                          {district.boss.completed ? 'DEFEATED 🏆' : 'READY 👾'}
                        </span>
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-arcade text-cyber-muted">
                        <span>CLEARANCE</span>
                        <span className="text-cyber-lime">{percent}%</span>
                      </div>
                      <div className="h-3 w-full bg-cyber-base rounded-lg border-2 border-black overflow-hidden p-0.5">
                        <motion.div
                          className="h-full rounded bg-gradient-to-r from-cyber-cyan to-cyber-lime"
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Play Action */}
                  <div className="pt-6">
                    <button
                      onClick={() => {
                        playInsertCoin(soundEnabled);
                        navigate(`/district/${district.id}`);
                      }}
                      className="w-full py-3.5 rounded-xl bg-cyber-cyan hover:bg-cyan-400 text-black font-arcade text-xs border-2 border-black shadow-brutal-cyan btn-arcade flex items-center justify-center gap-2 font-extrabold"
                    >
                      <Play className="w-4 h-4 fill-black" />
                      <span>ENTER DISTRICT</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}

            {/* Insert New Deck Cabinet Slot */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                playInsertCoin(soundEnabled);
                navigate('/upload');
              }}
              className="rounded-3xl border-4 border-dashed border-cyber-pink/40 hover:border-cyber-pink bg-cyber-card/40 p-8 flex flex-col items-center justify-center text-center cursor-pointer min-h-[260px] transition-all group shadow-brutal-black hover:shadow-brutal-pink"
            >
              <div className="w-16 h-16 rounded-2xl bg-cyber-base border-2 border-cyber-pink flex items-center justify-center text-cyber-pink mb-4 group-hover:scale-110 transition-transform shadow-brutal-pink">
                <Plus className="w-8 h-8 stroke-[3]" />
              </div>
              <h4 className="font-arcade text-xs sm:text-sm text-cyber-pink">
                INSERT DECK
              </h4>
              <p className="font-sans text-xs text-cyber-muted mt-2 max-w-[200px]">
                Drop .pptx or .pdf slides to forge a new district cabinet!
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};
