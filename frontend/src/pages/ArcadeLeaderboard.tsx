import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Trophy, Award, Zap, Flame, Shield, 
  RotateCcw, Sparkles, Skull, CheckCircle2, Lock
} from 'lucide-react';
import { api } from '../services/api';
import { PlayerArcadeProfile, RetroAchievement } from '../types';
import { Pixel } from '../components/mascot/Pixel';
import { useArcadeStore } from '../stores/useArcadeStore';
import { playClick, playInsertCoin } from '../utils/audio';

export const ArcadeLeaderboard: React.FC = () => {
  const navigate = useNavigate();
  const { soundEnabled, setShields, refreshProfile } = useArcadeStore();

  const [profile, setProfile] = useState<PlayerArcadeProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await api.getProfile();
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRechargeShields = async () => {
    try {
      const res = await api.rechargeShields();
      setShields(res.shields);
      playInsertCoin(soundEnabled);
      loadProfile();
      refreshProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetProfile = async () => {
    if (confirm('RESET ALL ARCADE PROGRESS? This clears all scores, badges, and districts!')) {
      try {
        await api.resetProgress();
        playClick(soundEnabled);
        loadProfile();
        refreshProfile();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Pixel size="default" state="thinking" speechText="READING CABINET HIGH SCORES..." />
        <div className="font-arcade text-xs text-cyber-yellow animate-pulse tracking-widest">
          CONNECTING TO LEADERBOARD ROM...
        </div>
      </div>
    );
  }

  // Sample arcade hall-of-fame high scores
  const highScores = [
    { rank: 1, callsign: 'SATOSHI_PM', score: 28450, district: 'District 0: The Foundry' },
    { rank: 2, callsign: profile?.callsign || 'NEON_RUNNER', score: profile?.total_score || 12400, district: 'Current Hero', isPlayer: true },
    { rank: 3, callsign: 'AGILE_NINJA', score: 11200, district: 'District 0: The Foundry' },
    { rank: 4, callsign: 'METRIC_GOD', score: 9800, district: 'District 0: The Foundry' },
    { rank: 5, callsign: 'PIXEL_WARRIOR', score: 7500, district: 'District 0: The Foundry' }
  ].sort((a, b) => b.score - a.score).map((item, idx) => ({ ...item, rank: idx + 1 }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 pb-32">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => {
            playClick(soundEnabled);
            navigate('/');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-card hover:bg-cyber-base border-2 border-black shadow-brutal-cyan text-xs font-arcade text-cyber-cyan btn-arcade"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>OVERWORLD</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRechargeShields}
            className="px-3 py-1.5 rounded-xl bg-cyber-cyan text-black font-arcade text-xs border-2 border-black shadow-[2px_2px_0_#000] btn-arcade flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>RECHARGE SHIELDS (5/5)</span>
          </button>
        </div>
      </div>

      {/* Hero Stats Marquee */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-cyber-card border-4 border-black p-6 sm:p-8 shadow-brutal-yellow relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyber-base border border-cyber-yellow text-xs font-arcade text-cyber-yellow">
              <Trophy className="w-3.5 h-3.5" />
              <span>ARCADE OPERATOR DOSSIER</span>
            </div>

            <h1 className="font-arcade text-xl sm:text-3xl text-cyber-text text-neon-yellow">
              {profile?.callsign || 'NEON_RUNNER_99'}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-arcade text-cyber-muted">
              <span>RANK: <span className="text-cyber-cyan">{profile?.rank || 'ROOKIE OPERATOR'}</span></span>
              <span>•</span>
              <span>STREAK: <span className="text-cyber-yellow">{profile?.streak_days || 1} DAYS 🔥</span></span>
              <span>•</span>
              <span>BOSSES SLAIN: <span className="text-cyber-pink">{profile?.bosses_defeated || 0} 💀</span></span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0 font-arcade text-center">
            <div className="p-4 rounded-2xl bg-cyber-base border-2 border-black min-w-[130px]">
              <div className="text-[10px] text-cyber-muted">TOTAL CREDITS</div>
              <div className="text-base text-cyber-yellow mt-1">{profile?.credits || 0}</div>
            </div>

            <div className="p-4 rounded-2xl bg-cyber-base border-2 border-black min-w-[130px]">
              <div className="text-[10px] text-cyber-muted">HIGH SCORE</div>
              <div className="text-base text-cyber-lime mt-1">{profile?.total_score || 0}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Retro Achievements Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-cyber-pink" />
            <h2 className="font-arcade text-sm text-cyber-pink tracking-wider">
              RETRO TROPHIES & BADGES ({profile?.achievements?.filter(a => a.unlocked).length || 0} / {profile?.achievements?.length || 12})
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {profile?.achievements?.map((ach) => {
            const isUnlocked = ach.unlocked;

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border-3 border-black space-y-2 relative transition-all ${
                  isUnlocked
                    ? 'bg-cyber-card shadow-[4px_4px_0_#000] border-black'
                    : 'bg-cyber-base/70 border-zinc-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center font-arcade text-base ${
                      isUnlocked
                        ? 'bg-cyber-yellow text-black shadow-[2px_2px_0_#000]'
                        : 'bg-zinc-800 text-zinc-600'
                    }`}
                  >
                    {isUnlocked ? (
                      <span>{ach.icon || '🏆'}</span>
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>

                  <span className={`text-[10px] font-arcade ${isUnlocked ? 'text-cyber-lime' : 'text-zinc-600'}`}>
                    +{ach.xp_value} XP
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className={`font-arcade text-xs ${isUnlocked ? 'text-cyber-text' : 'text-zinc-500'}`}>
                    {ach.title}
                  </h3>
                  <p className="font-sans text-[11px] text-cyber-muted leading-snug">
                    {ach.description}
                  </p>
                </div>

                {isUnlocked && (
                  <div className="text-[9px] font-arcade text-cyber-lime flex items-center gap-1 pt-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>UNLOCKED</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hall of Fame High Scores Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-cyber-yellow" />
          <h2 className="font-arcade text-sm text-cyber-yellow tracking-wider">
            PRODUCT CITY HALL OF FAME
          </h2>
        </div>

        <div className="rounded-3xl bg-cyber-card border-4 border-black p-6 shadow-brutal-lime overflow-x-auto">
          <table className="w-full text-left font-arcade text-xs">
            <thead>
              <tr className="border-b-2 border-black/40 text-cyber-muted pb-3">
                <th className="py-3 px-4">RANK</th>
                <th className="py-3 px-4">OPERATOR</th>
                <th className="py-3 px-4">TOP DISTRICT</th>
                <th className="py-3 px-4 text-right">SCORE</th>
              </tr>
            </thead>
            <tbody>
              {highScores.map((entry) => (
                <tr
                  key={entry.rank}
                  className={`border-b border-black/20 ${
                    entry.isPlayer ? 'bg-cyber-pink/20 text-cyber-pink font-bold' : 'text-cyber-text'
                  }`}
                >
                  <td className="py-3 px-4">
                    <span className={`inline-block w-6 h-6 text-center leading-6 rounded ${
                      entry.rank === 1 ? 'bg-cyber-yellow text-black font-extrabold' : 'text-cyber-muted'
                    }`}>
                      #{entry.rank}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {entry.callsign} {entry.isPlayer && '👈 (YOU)'}
                  </td>
                  <td className="py-3 px-4 text-cyber-muted text-[11px] font-sans">
                    {entry.district}
                  </td>
                  <td className="py-3 px-4 text-right text-cyber-lime font-bold">
                    {entry.score.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dangerous Operations Zone */}
      <div className="pt-6 border-t-2 border-black/30 flex items-center justify-between">
        <div className="text-xs text-cyber-muted font-arcade">
          RESET RUNNER DATA / NEW GAME
        </div>

        <button
          onClick={handleResetProfile}
          className="px-4 py-2 rounded-xl bg-black hover:bg-zinc-900 text-red-500 font-arcade text-[10px] border border-red-500/40 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>PURGE ARCADE STORAGE</span>
        </button>
      </div>
    </div>
  );
};
