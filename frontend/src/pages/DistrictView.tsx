import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, BookOpen, Layers, Swords, Lock, CheckCircle2, 
  Sparkles, Skull, Zap, Trophy, ShieldAlert
} from 'lucide-react';
import { api } from '../services/api';
import { District, Level } from '../types';
import { Pixel } from '../components/mascot/Pixel';
import { BossMonsterAvatar } from '../components/arcade/BossMonsterAvatar';
import { useArcadeStore } from '../stores/useArcadeStore';
import { playClick, playLaserShot } from '../utils/audio';

export const DistrictView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { soundEnabled } = useArcadeStore();

  const [district, setDistrict] = useState<(District & { levels: Level[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadDistrictData(id);
  }, [id]);

  const loadDistrictData = async (districtId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDistrictById(districtId);
      setDistrict(data);
    } catch (err: any) {
      setError(err.message || 'Failed to breach district firewall');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Pixel size="default" state="thinking" speechText="INITIALIZING DISTRICT MAINFRAME..." />
        <div className="font-arcade text-xs text-cyber-cyan animate-pulse tracking-widest">
          CONNECTING TO NEURAL CIRCUITRY...
        </div>
      </div>
    );
  }

  if (error || !district) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-cyber-card border-4 border-cyber-pink shadow-brutal-pink text-center space-y-6">
        <Pixel size="default" state="alarm" speechText="ERROR 404: District signal lost!" />
        <h2 className="font-arcade text-sm text-cyber-pink">{error || 'District Not Found'}</h2>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-xl bg-cyber-cyan text-black font-arcade text-xs border-2 border-black shadow-brutal-cyan btn-arcade"
        >
          RETURN TO OVERWORLD
        </button>
      </div>
    );
  }

  const completedCount = district.levels.filter((l) => l.completed).length;
  const totalCount = district.levels.length;
  const allLevelsDone = totalCount > 0 && completedCount === totalCount;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 pb-32">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => {
            playClick(soundEnabled);
            navigate('/');
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyber-card hover:bg-cyber-base border-2 border-black shadow-brutal-cyan text-xs font-arcade text-cyber-cyan btn-arcade"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>OVERWORLD MAP</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyber-card border border-cyber-lime/40 text-xs font-arcade text-cyber-lime">
          <Zap className="w-3.5 h-3.5" />
          <span>NODE PROGRESS: {completedCount}/{totalCount} ({progressPct}%)</span>
        </div>
      </div>

      {/* District Header Cabinet Display */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-cyber-card border-4 border-black p-6 sm:p-8 shadow-brutal-pink relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none select-none">
          <Sparkles className="w-48 h-48 text-cyber-pink" />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-cyber-base border border-cyber-pink text-[10px] font-arcade text-cyber-pink tracking-wider">
                DISTRICT {district.district_order}
              </span>
              <span className="px-2.5 py-1 rounded bg-cyber-base border border-cyber-cyan/50 text-[10px] font-arcade text-cyber-cyan tracking-wider">
                THEME: {(district.cyber_theme || 'CYBER').toUpperCase()}
              </span>
              {district.boss.defeated && (
                <span className="px-2.5 py-1 rounded bg-cyber-lime text-black text-[10px] font-arcade font-bold tracking-wider">
                  BOSS SLAIN
                </span>
              )}
            </div>

            <h1 className="font-arcade text-xl sm:text-3xl text-cyber-text text-neon-pink leading-tight">
              {district.title}
            </h1>

            <p className="font-sans text-xs sm:text-sm text-cyber-muted font-medium leading-relaxed">
              {district.description}
            </p>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] font-arcade text-cyber-muted">
                <span>CIRCUIT CLEARANCE</span>
                <span className="text-cyber-lime">{progressPct}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-cyber-base border-2 border-black overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyber-cyan via-cyber-pink to-cyber-lime transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="shrink-0 self-center md:self-auto">
            <Pixel
              size="default"
              state={district.boss.defeated ? 'dancing' : progressPct > 50 ? 'cheering' : 'idle'}
              speechText={
                district.boss.defeated
                  ? "Boss defeated! District fully liberated, Agent!"
                  : progressPct > 50
                  ? "Almost at the Boss Gate! Keep comboing!"
                  : "Crack the level nodes below to breach the boss barrier!"
              }
            />
          </div>
        </div>
      </motion.div>

      {/* Motherboard Node Map */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyber-cyan animate-ping" />
          <h2 className="font-arcade text-sm text-cyber-cyan tracking-wider">
            CIRCUIT NODES // SELECT PROTOCOL
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {district.levels.map((level, idx) => {
            const isUnlocked = level.unlocked;
            const isCompleted = level.completed;
            const nodeNum = level.order_num ?? level.level_number ?? (idx + 1);
            const slideRef = level.slide_refs || level.slide_reference || `SLIDE ${idx * 4 + 1}-${idx * 4 + 4}`;
            const summaryText = level.analogy ? `💡 Analogy: ${level.analogy}` : (level.explanation || level.summary || '');

            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={`relative rounded-2xl border-4 border-black p-5 sm:p-6 transition-all duration-200 ${
                  isCompleted
                    ? 'bg-cyber-card shadow-brutal-lime border-black'
                    : isUnlocked
                    ? 'bg-cyber-card shadow-brutal-cyan border-black'
                    : 'bg-cyber-base/70 border-zinc-800 opacity-60'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                  <div className="flex items-start gap-4">
                    {/* Node Number Hex Badge */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-arcade text-base font-bold shrink-0 border-2 border-black ${
                        isCompleted
                          ? 'bg-cyber-lime text-black shadow-[3px_3px_0_#000]'
                          : isUnlocked
                          ? 'bg-cyber-cyan text-black shadow-[3px_3px_0_#000]'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 stroke-[3]" />
                      ) : isUnlocked ? (
                        <span>#{nodeNum}</span>
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-arcade bg-cyber-base border border-cyber-muted/30 text-cyber-muted">
                          {slideRef}
                        </span>

                        {isCompleted && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-arcade bg-cyber-lime/20 text-cyber-lime border border-cyber-lime/40">
                            CLEARED +{level.xp_reward || 50} XP
                          </span>
                        )}
                        {!isCompleted && isUnlocked && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-arcade bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40">
                            READY TO CRACK
                          </span>
                        )}
                      </div>

                      <h3 className="font-arcade text-sm sm:text-base text-cyber-text tracking-wide">
                        {level.title}
                      </h3>

                      <p className="font-sans text-xs text-cyber-muted max-w-2xl leading-relaxed">
                        {summaryText}
                      </p>
                    </div>
                  </div>

                  {/* Actions for this Node */}
                  {isUnlocked ? (
                    <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto pt-2 lg:pt-0">
                      <button
                        onClick={() => {
                          playClick(soundEnabled);
                          navigate(`/district/${district.id}/node/${nodeNum}`);
                        }}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-cyber-base hover:bg-cyber-card border-2 border-black shadow-[3px_3px_0_#000] text-xs font-arcade text-cyber-cyan btn-arcade inline-flex items-center justify-center gap-2"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>BRIEFING</span>
                      </button>

                      <button
                        onClick={() => {
                          playClick(soundEnabled);
                          navigate(`/district/${district.id}/node/${nodeNum}/cards`);
                        }}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-cyber-base hover:bg-cyber-card border-2 border-black shadow-[3px_3px_0_#000] text-xs font-arcade text-cyber-yellow btn-arcade inline-flex items-center justify-center gap-2"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>HOLO-CARDS</span>
                      </button>

                      <button
                        onClick={() => {
                          playLaserShot(soundEnabled);
                          navigate(`/district/${district.id}/node/${nodeNum}/battle`);
                        }}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyber-pink hover:bg-pink-600 text-white font-arcade text-xs border-2 border-black shadow-brutal-pink btn-arcade inline-flex items-center justify-center gap-2"
                      >
                        <Swords className="w-3.5 h-3.5" />
                        <span>BATTLE QUIZ</span>
                      </button>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-base border border-zinc-800 text-xs font-arcade text-zinc-500">
                      <Lock className="w-4 h-4" />
                      <span>CLEAR PREVIOUS NODE TO UNLOCK</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Boss Gate Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-3xl border-4 border-black p-6 sm:p-8 relative overflow-hidden ${
          district.boss.defeated
            ? 'bg-cyber-card shadow-brutal-lime'
            : allLevelsDone
            ? 'bg-gradient-to-br from-cyber-card via-cyber-card to-cyber-base shadow-brutal-pink border-cyber-pink animate-pulse'
            : 'bg-cyber-base/80 shadow-brutal-pink border-cyber-pink/50 opacity-90'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0">
              <BossMonsterAvatar
                monsterName={district.boss.name}
                hpPercent={district.boss.defeated ? 0 : 100}
                isHit={false}
              />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyber-base border border-cyber-pink text-xs font-arcade text-cyber-pink">
                <Skull className="w-3.5 h-3.5" />
                <span>DISTRICT APEX THREAT // LEVEL BOSS</span>
              </div>

              <h2 className="font-arcade text-xl sm:text-2xl text-cyber-text text-neon-pink">
                {district.boss.name}
              </h2>

              <p className="font-sans text-xs sm:text-sm text-cyber-muted max-w-xl">
                {district.boss.description}
              </p>

              <div className="flex items-center gap-4 text-xs font-arcade text-cyber-yellow pt-1">
                <span>HP: {district.boss.health}</span>
                <span>•</span>
                <span>ATTACK: {district.boss.attack_power} DMG</span>
                <span>•</span>
                <span className="text-cyber-lime">REWARD: +500 CREDITS + BOSS TROPHY</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 w-full lg:w-auto flex flex-col items-center gap-2">
            {district.boss.defeated ? (
              <div className="px-6 py-4 rounded-2xl bg-cyber-lime text-black font-arcade text-xs font-bold border-2 border-black shadow-[4px_4px_0_#000] flex items-center gap-2 text-center">
                <Trophy className="w-5 h-5" />
                <span>BOSS DESTROYED // DISTRICT SECURED</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  playLaserShot(soundEnabled);
                  navigate(`/district/${district.id}/boss`);
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-cyber-pink hover:bg-pink-600 text-white font-arcade text-sm border-3 border-black shadow-brutal-pink btn-arcade flex items-center justify-center gap-3"
              >
                <Swords className="w-5 h-5 stroke-[2.5]" />
                <span>ENTER BOSS CHAMBER</span>
              </button>
            )}

            {!allLevelsDone && !district.boss.defeated && (
              <span className="text-[10px] font-arcade text-cyber-pink flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                Recommended: Complete all 4 nodes before challenging!
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
