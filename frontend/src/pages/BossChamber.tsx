import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Skull, Shield, Swords, Sparkles, Trophy, 
  CheckCircle2, XCircle, Zap, Flame, AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { BossMonster, Question } from '../types';
import { BossMonsterAvatar } from '../components/arcade/BossMonsterAvatar';
import { Pixel } from '../components/mascot/Pixel';
import { useArcadeStore } from '../stores/useArcadeStore';
import { 
  playClick, playLaserShot, playBossHit, playShieldLost, 
  playVictoryFanfare, playComboMultiplier 
} from '../utils/audio';

export const BossChamber: React.FC = () => {
  const { id: districtId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    shields, deductShield, addCredits, soundEnabled, 
    refreshProfile 
  } = useArcadeStore();

  const [boss, setBoss] = useState<BossMonster | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bossHp, setBossHp] = useState(500);
  const [maxBossHp, setMaxBossHp] = useState(500);
  const [isBossHit, setIsBossHit] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answersRecord, setAnswersRecord] = useState<Record<string, string>>({});
  const [floatingDamage, setFloatingDamage] = useState<{ id: number; text: string; color: string } | null>(null);
  const [screenShake, setScreenShake] = useState(false);
  const [bossDefeated, setBossDefeated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (districtId) loadBossEncounter();
  }, [districtId]);

  const loadBossEncounter = async () => {
    try {
      setLoading(true);
      const data = await api.getBossBattle(districtId!);
      setBoss(data.boss);
      setQuestions(data.questions || []);
      const hp = data.boss.health || 500;
      setBossHp(data.boss.defeated ? 0 : hp);
      setMaxBossHp(hp);
      setBossDefeated(!!data.boss.defeated);
      setCurrentIndex(0);
      setRevealed(false);
      setSelectedAnswer(null);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (option: string) => {
    if (revealed || bossDefeated || !boss) return;
    processAnswer(option);
  };

  const processAnswer = (answer: string) => {
    const q = questions[currentIndex];
    setSelectedAnswer(answer);
    setRevealed(true);
    setAnswersRecord((prev) => ({ ...prev, [q.id]: answer }));

    const isCorrect = answer.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();

    if (isCorrect) {
      // Calculate damage dealt to boss
      const damage = Math.round(maxBossHp / Math.max(questions.length, 1));
      const nextHp = Math.max(0, bossHp - damage);
      setBossHp(nextHp);

      setIsBossHit(true);
      setTimeout(() => setIsBossHit(false), 600);

      playBossHit(soundEnabled);
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 400);

      setFloatingDamage({
        id: Date.now(),
        text: `CRITICAL STRIKE! -${damage} HP`,
        color: '#FF2E93'
      });

      addCredits(100);

      if (nextHp <= 0) {
        triggerBossDefeated();
      }
    } else {
      // Boss counter-attacks!
      deductShield();
      playShieldLost(soundEnabled);

      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 500);

      setFloatingDamage({
        id: Date.now(),
        text: `BOSS ATTACK! SHIELD COMPROMISED!`,
        color: '#FF8A00'
      });
    }
  };

  const triggerBossDefeated = async () => {
    setBossDefeated(true);
    playVictoryFanfare(soundEnabled);
    addCredits(500);

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#FF2E93', '#C6FF00', '#00E5FF', '#FFD60A']
    });

    try {
      await api.submitBossBattle(districtId!, answersRecord);
      refreshProfile();
    } catch (err) {
      console.warn('Sync boss defeat warning:', err);
    }
  };

  const handleNextStrike = () => {
    if (bossHp <= 0) {
      triggerBossDefeated();
      return;
    }

    if (currentIndex + 1 < questions.length) {
      setSelectedAnswer(null);
      setRevealed(false);
      setFloatingDamage(null);
      setCurrentIndex((prev) => prev + 1);
    } else {
      // End of questions but boss still has HP
      if (bossHp <= maxBossHp * 0.3) {
        // Close enough, finish him!
        setBossHp(0);
        triggerBossDefeated();
      } else {
        alert('The Boss withstood your strikes! Recharge and challenge again!');
        navigate(`/district/${districtId}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Pixel size="default" state="alarm" speechText="WARNING: SEVERE ANOMALY DETECTED..." />
        <div className="font-arcade text-xs text-cyber-pink animate-pulse tracking-widest">
          BREACHING BOSS CHAMBER GATES...
        </div>
      </div>
    );
  }

  if (!boss) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-cyber-card border-4 border-cyber-pink shadow-brutal-pink text-center space-y-4">
        <h2 className="font-arcade text-sm text-cyber-pink">Boss Matrix Offline</h2>
        <button
          onClick={() => navigate(`/district/${districtId}`)}
          className="px-6 py-2.5 rounded-xl bg-cyber-cyan text-black font-arcade text-xs border-2 border-black"
        >
          BACK
        </button>
      </div>
    );
  }

  const hpPercent = maxBossHp > 0 ? Math.round((bossHp / maxBossHp) * 100) : 0;
  const q = questions[currentIndex];
  const isCorrect = revealed && selectedAnswer?.trim().toLowerCase() === q?.correct_answer?.trim().toLowerCase();

  return (
    <div className={`max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 pb-32 ${screenShake ? 'animate-shake' : ''}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => {
            playClick(soundEnabled);
            navigate(`/district/${districtId}`);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-card hover:bg-cyber-base border-2 border-black shadow-brutal-cyan text-xs font-arcade text-cyber-cyan btn-arcade"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>FLEE CHAMBER</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyber-card border-2 border-black">
          <Shield className="w-4 h-4 text-cyber-cyan" />
          <span className="font-arcade text-xs text-cyber-text">
            YOUR SHIELDS: <span className="text-cyber-cyan font-bold">{shields}/5</span>
          </span>
        </div>
      </div>

      {/* Epic Boss Arena Arena Display */}
      <div className="rounded-3xl bg-cyber-card border-4 border-black p-6 sm:p-10 shadow-brutal-pink space-y-6 relative overflow-hidden">
        {/* Boss HP Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-arcade">
            <div className="flex items-center gap-2 text-cyber-pink">
              <Skull className="w-4 h-4" />
              <span>{boss.name.toUpperCase()} // HP METER</span>
            </div>
            <div className="text-cyber-yellow">
              {bossHp} / {maxBossHp} HP ({hpPercent}%)
            </div>
          </div>

          <div className="w-full h-4 sm:h-5 rounded-full bg-cyber-base border-3 border-black overflow-hidden p-0.5 shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                hpPercent > 50
                  ? 'bg-gradient-to-r from-cyber-pink to-cyber-yellow'
                  : hpPercent > 20
                  ? 'bg-gradient-to-r from-cyber-pink to-red-600 animate-pulse'
                  : 'bg-red-600 animate-ping'
              }`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        {/* Boss Monster & Mascot Stage */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-around gap-6 border-y-2 border-black/40">
          <div className="relative">
            <div className="w-40 h-40 sm:w-52 sm:h-52">
              <BossMonsterAvatar
                monsterName={boss.name}
                hpPercent={hpPercent}
                isHit={isBossHit}
              />
            </div>

            {floatingDamage && (
              <motion.div
                key={floatingDamage.id}
                initial={{ opacity: 0, scale: 0.5, y: 0 }}
                animate={{ opacity: 1, scale: 1.2, y: -25 }}
                className="absolute top-0 right-0 font-arcade text-xs px-3 py-1.5 rounded-xl bg-black border-2 border-black shadow-[3px_3px_0_#000]"
                style={{ color: floatingDamage.color }}
              >
                {floatingDamage.text}
              </motion.div>
            )}
          </div>

          {/* Boss description / Pixel commentary */}
          <div className="max-w-md text-center sm:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyber-base border border-cyber-pink text-[10px] font-arcade text-cyber-pink">
              <span>SPECIAL ABILITY: {boss.special_move || 'SCOPE DETONATION'}</span>
            </div>

            <h3 className="font-arcade text-lg sm:text-xl text-cyber-text">
              {boss.name}
            </h3>

            <p className="font-sans text-xs sm:text-sm text-cyber-muted leading-relaxed">
              {boss.description}
            </p>

            <div className="pt-2">
              <Pixel
                size="small"
                state={bossDefeated ? 'dancing' : isBossHit ? 'cheering' : shields < 2 ? 'alarm' : 'idle'}
                speechText={
                  bossDefeated
                    ? "BOOM! Boss defeated! Product City is saved!"
                    : isBossHit
                    ? "Direct hit! Keep draining its health!"
                    : "Target its weak points grounded in the lecture slides!"
                }
              />
            </div>
          </div>
        </div>

        {/* Combat Prompt or Victory Banner */}
        {!bossDefeated && q ? (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-arcade text-cyber-cyan">
                BOSS STRIKE {currentIndex + 1} OF {questions.length} // ALL-DISTRICTS GROUNDING
              </span>
              <span className="text-[10px] font-arcade text-cyber-muted">
                {q.slide_ref || q.slide_reference || 'SLIDE VERBATIM'}
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-cyber-base border-2 border-black font-arcade text-xs sm:text-sm text-cyber-text leading-relaxed">
              {q.question || q.question_text}
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {q.options?.map((opt, idx) => {
                const isSelected = selectedAnswer === opt;
                const isTargetCorrect = revealed && opt.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();
                const isTargetWrong = revealed && isSelected && !isTargetCorrect;

                return (
                  <button
                    key={idx}
                    disabled={revealed}
                    onClick={() => handleSelectOption(opt)}
                    className={`p-4 rounded-2xl border-3 border-black text-left font-sans text-xs sm:text-sm font-semibold transition-all flex items-start gap-3 ${
                      isTargetCorrect
                        ? 'bg-cyber-lime text-black shadow-brutal-lime border-black font-bold'
                        : isTargetWrong
                        ? 'bg-cyber-pink text-white shadow-brutal-pink border-black'
                        : isSelected
                        ? 'bg-cyber-cyan text-black shadow-brutal-cyan'
                        : 'bg-cyber-base hover:bg-cyber-card text-cyber-text shadow-[3px_3px_0_#000] btn-arcade'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-black text-white font-arcade text-xs flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Result & Next Strike Button */}
            <AnimatePresence>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="text-xs font-sans text-cyber-muted">
                    {q.explanation}
                  </div>

                  <button
                    onClick={handleNextStrike}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-cyber-pink hover:bg-pink-600 text-white font-arcade text-xs border-3 border-black shadow-brutal-pink btn-arcade shrink-0"
                  >
                    {bossHp <= 0 ? 'FINISH BOSS! >>' : 'NEXT STRIKE >>'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Boss Slain Celebration */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4 py-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-cyber-lime text-black font-arcade text-xs font-bold border-2 border-black shadow-[3px_3px_0_#000]">
              <Trophy className="w-4 h-4" />
              <span>APEX THREAT NEUTRALIZED!</span>
            </div>

            <h2 className="font-arcade text-2xl sm:text-4xl text-cyber-text text-neon-pink">
              SLAYER OF {boss.name.toUpperCase()}!
            </h2>

            <p className="font-sans text-xs sm:text-sm text-cyber-muted max-w-md mx-auto">
              You have completely freed this district from the clutches of {boss.name}. All concepts permanently mastered.
            </p>

            <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-cyber-base border-2 border-black font-arcade text-xs text-cyber-yellow">
              <span>+500 CREDITS AWARDED</span>
              <span>•</span>
              <span className="text-cyber-lime">RETRO BOSS TROPHY UNLOCKED</span>
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  playClick(soundEnabled);
                  navigate('/');
                }}
                className="px-8 py-4 rounded-2xl bg-cyber-lime hover:bg-lime-400 text-black font-arcade text-xs border-3 border-black shadow-brutal-lime btn-arcade"
              >
                RETURN TO PRODUCT CITY
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
