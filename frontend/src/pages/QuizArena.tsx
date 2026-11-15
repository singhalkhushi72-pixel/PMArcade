import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Shield, Zap, Sparkles, CheckCircle2, 
  XCircle, Clock, Trophy, Flame, HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { Level, Question } from '../types';
import { Pixel } from '../components/mascot/Pixel';
import { useArcadeStore } from '../stores/useArcadeStore';
import { 
  playClick, playLaserShot, playShieldLost, 
  playComboMultiplier, playVictoryFanfare 
} from '../utils/audio';

export const QuizArena: React.FC = () => {
  const { id: districtId, num } = useParams<{ id: string; num: string }>();
  const navigate = useNavigate();
  const { 
    shields, deductShield, addCredits, soundEnabled, 
    setShields, refreshProfile 
  } = useArcadeStore();

  const [levelData, setLevelData] = useState<Level | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [fillInput, setFillInput] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [answersRecord, setAnswersRecord] = useState<Record<string, string>>({});
  
  // Combat stats
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [screenShake, setScreenShake] = useState(false);
  const [battleComplete, setBattleComplete] = useState(false);
  const [floatingDamage, setFloatingDamage] = useState<{ id: number; text: string; color: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (districtId && num) {
      loadBattleData();
    }
  }, [districtId, num]);

  const loadBattleData = async () => {
    try {
      setLoading(true);
      const data = await api.getLevel(districtId!, parseInt(num!));
      setLevelData(data);
      setQuestions(data.questions || []);
      setCurrentIndex(0);
      setCombo(0);
      setMaxCombo(0);
      setScore(0);
      setBattleComplete(false);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (option: string) => {
    if (revealed || battleComplete) return;
    processAnswer(option);
  };

  const handleFillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (revealed || battleComplete || !fillInput.trim()) return;
    processAnswer(fillInput.trim());
  };

  const processAnswer = (answer: string) => {
    const q = questions[currentIndex];
    setSelectedAnswer(answer);
    setRevealed(true);
    setAnswersRecord((prev) => ({ ...prev, [q.id]: answer }));

    const isCorrect = answer.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();

    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      const xpEarned = 50 + newCombo * 15;
      setScore((prev) => prev + xpEarned);
      addCredits(xpEarned);

      playLaserShot(soundEnabled);
      if (newCombo > 1) {
        setTimeout(() => playComboMultiplier(soundEnabled), 200);
      }

      setFloatingDamage({
        id: Date.now(),
        text: newCombo > 1 ? `COMBO x${newCombo}! +${xpEarned} XP` : `CRITICAL HIT! +${xpEarned} XP`,
        color: '#C6FF00'
      });
    } else {
      setCombo(0);
      deductShield();
      playShieldLost(soundEnabled);

      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 500);

      setFloatingDamage({
        id: Date.now(),
        text: `SHIELD COMPROMISED! -1`,
        color: '#FF2E93'
      });
    }
  };

  const handleNextQuestion = async () => {
    if (currentIndex + 1 < questions.length) {
      setSelectedAnswer(null);
      setFillInput('');
      setRevealed(false);
      setFloatingDamage(null);
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Complete Battle
      setBattleComplete(true);
      playVictoryFanfare(soundEnabled);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00E5FF', '#FF2E93', '#C6FF00', '#FFD60A']
      });

      try {
        await api.submitLevelBattle({
          levelId: levelData!.id,
          districtId: districtId!,
          answers: answersRecord,
          maxCombo
        });
        refreshProfile();
      } catch (err) {
        console.warn('Sync combat result error:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Pixel size="default" state="thinking" speechText="INITIALIZING COMBAT PROTOCOL..." />
        <div className="font-arcade text-xs text-cyber-pink animate-pulse tracking-widest">
          SUMMONING ARENA DRONES...
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];
  const isCorrect = revealed && selectedAnswer?.trim().toLowerCase() === q?.correct_answer?.trim().toLowerCase();

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 pb-32 ${screenShake ? 'animate-shake' : ''}`}>
      {/* Top Combat Status Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => {
            playClick(soundEnabled);
            navigate(`/district/${districtId}`);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-card hover:bg-cyber-base border-2 border-black shadow-brutal-cyan text-xs font-arcade text-cyber-cyan btn-arcade"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETREAT</span>
        </button>

        {/* Shields & Combo Meters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyber-card border-2 border-black shadow-[2px_2px_0_#000]">
            <Shield className={`w-4 h-4 ${shields > 1 ? 'text-cyber-cyan' : 'text-cyber-pink animate-pulse'}`} />
            <span className="font-arcade text-xs text-cyber-text">
              SHIELDS: <span className={shields > 1 ? 'text-cyber-cyan' : 'text-cyber-pink font-bold'}>{shields}/5</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyber-card border-2 border-black shadow-[2px_2px_0_#000]">
            <Flame className={`w-4 h-4 ${combo > 1 ? 'text-cyber-yellow animate-bounce' : 'text-zinc-600'}`} />
            <span className={`font-arcade text-xs ${combo > 1 ? 'text-cyber-yellow font-extrabold' : 'text-cyber-muted'}`}>
              COMBO x{combo}
            </span>
          </div>
        </div>
      </div>

      {!battleComplete && q ? (
        <div className="space-y-6">
          {/* Wave indicator & Floating Damage */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-lg bg-cyber-card border border-cyber-pink text-xs font-arcade text-cyber-pink">
              WAVE {currentIndex + 1} OF {questions.length} // TYPE: {(q.question_type || q.format || 'MCQ').toUpperCase()}
            </span>

            {floatingDamage && (
              <motion.div
                key={floatingDamage.id}
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1.1, y: -5 }}
                className="font-arcade text-xs px-3 py-1 rounded bg-black border-2 border-black shadow-[2px_2px_0_#000]"
                style={{ color: floatingDamage.color }}
              >
                {floatingDamage.text}
              </motion.div>
            )}
          </div>

          {/* Question Display Cabinet */}
          <div className="rounded-3xl bg-cyber-card border-4 border-black p-6 sm:p-10 shadow-brutal-pink space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b-2 border-black/40 pb-3">
              <span className="text-[10px] font-arcade text-cyber-muted">
                {q.slide_ref || q.slide_reference || 'SLIDE GROUNDING'}
              </span>
              <span className="text-[10px] font-arcade text-cyber-yellow">
                DIFFICULTY: {(q.difficulty || 'STANDARD').toUpperCase()}
              </span>
            </div>

            <h2 className="font-arcade text-base sm:text-xl text-cyber-text leading-relaxed tracking-wide">
              {q.question || q.question_text}
            </h2>

            {/* Answer Options */}
            <div className="pt-2 space-y-3">
              {q.options && q.options.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, idx) => {
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
              ) : (
                /* Fill in the blank input */
                <form onSubmit={handleFillSubmit} className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      disabled={revealed}
                      value={fillInput}
                      onChange={(e) => setFillInput(e.target.value)}
                      placeholder="Type tactical answer here..."
                      className="flex-1 px-4 py-3 rounded-2xl bg-cyber-base border-3 border-black text-sm text-cyber-text placeholder:text-zinc-600 focus:outline-none focus:border-cyber-cyan"
                    />
                    <button
                      type="submit"
                      disabled={revealed || !fillInput.trim()}
                      className="px-6 py-3 rounded-2xl bg-cyber-cyan text-black font-arcade text-xs border-3 border-black shadow-brutal-cyan btn-arcade"
                    >
                      FIRE
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Answer Explanation Reveal */}
            <AnimatePresence>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`p-5 rounded-2xl border-2 border-black space-y-2 ${
                    isCorrect ? 'bg-cyber-lime/20 border-cyber-lime' : 'bg-cyber-pink/20 border-cyber-pink'
                  }`}
                >
                  <div className="flex items-center gap-2 font-arcade text-xs">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-cyber-lime" />
                        <span className="text-cyber-lime font-bold">TACTICAL HIT! CORRECT ANSWER</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-cyber-pink" />
                        <span className="text-cyber-pink font-bold">
                          MISSILE DEFLECTED! CORRECT: {q.correct_answer}
                        </span>
                      </>
                    )}
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-cyber-text leading-relaxed">
                    {q.explanation}
                  </p>

                  <div className="text-[10px] font-arcade text-cyber-muted pt-1">
                    SOURCE GROUNDING: {q.slide_ref || q.slide_reference || 'Course Lecture Archive'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Advance Button */}
            {revealed && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="px-8 py-3.5 rounded-2xl bg-cyber-cyan hover:bg-cyan-400 text-black font-arcade text-xs border-3 border-black shadow-brutal-cyan btn-arcade"
                >
                  {currentIndex + 1 < questions.length ? 'NEXT ENCOUNTER >>' : 'COMPLETE BATTLE >>'}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Battle Complete Victory / Defeat Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl bg-cyber-card border-4 border-black p-8 sm:p-12 shadow-brutal-lime text-center space-y-6"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-cyber-lime border-4 border-black shadow-[4px_4px_0_#000] flex items-center justify-center">
            <Trophy className="w-10 h-10 text-black" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded bg-cyber-base border border-cyber-lime text-xs font-arcade text-cyber-lime">
              COMBAT PROTOCOL CLEARED
            </span>
            <h2 className="font-arcade text-2xl sm:text-3xl text-cyber-text text-neon-lime">
              NODE SECURED!
            </h2>
            <p className="font-sans text-xs sm:text-sm text-cyber-muted max-w-md mx-auto">
              Your neural recall shredded the enemy drones. Tactical mastery unlocked!
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto font-arcade">
            <div className="p-3 rounded-2xl bg-cyber-base border-2 border-black">
              <div className="text-[10px] text-cyber-muted">BATTLE SCORE</div>
              <div className="text-sm text-cyber-yellow">{score}</div>
            </div>
            <div className="p-3 rounded-2xl bg-cyber-base border-2 border-black">
              <div className="text-[10px] text-cyber-muted">MAX COMBO</div>
              <div className="text-sm text-cyber-pink">x{maxCombo}</div>
            </div>
            <div className="p-3 rounded-2xl bg-cyber-base border-2 border-black">
              <div className="text-[10px] text-cyber-muted">SHIELDS LEFT</div>
              <div className="text-sm text-cyber-cyan">{shields}/5</div>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                playClick(soundEnabled);
                loadBattleData();
              }}
              className="px-6 py-3 rounded-xl bg-cyber-base hover:bg-cyber-card border-2 border-black shadow-[3px_3px_0_#000] text-xs font-arcade text-cyber-text btn-arcade"
            >
              REPLAY BATTLE
            </button>

            <button
              onClick={() => {
                playLaserShot(soundEnabled);
                navigate(`/district/${districtId}`);
              }}
              className="px-6 py-3 rounded-xl bg-cyber-lime hover:bg-lime-400 text-black font-arcade text-xs border-2 border-black shadow-brutal-lime btn-arcade"
            >
              CIRCUIT MAP
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
