import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, RotateCw, Sparkles, CheckCircle2, 
  HelpCircle, Zap, Layers, Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { Flashcard } from '../types';
import { Pixel } from '../components/mascot/Pixel';
import { useArcadeStore } from '../stores/useArcadeStore';
import { playClick, playLaserShot, playComboMultiplier, playVictoryFanfare } from '../utils/audio';

export const HoloDeck: React.FC = () => {
  const { id: districtId, num } = useParams<{ id?: string; num?: string }>();
  const navigate = useNavigate();
  const { soundEnabled, addCredits, refreshProfile } = useArcadeStore();

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);

  useEffect(() => {
    loadCards();
  }, [districtId, num]);

  // Keyboard shortcut listener for spacebar flip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !sessionCompleted && cards.length > 0) {
        e.preventDefault();
        handleFlip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, sessionCompleted, cards.length]);

  const loadCards = async () => {
    try {
      setLoading(true);
      let loadedCards: Flashcard[] = [];
      if (districtId && num) {
        const level = await api.getLevel(districtId, parseInt(num));
        loadedCards = level.flashcards || [];
      } else {
        loadedCards = await api.getDueFlashcards(districtId);
      }
      setCards(loadedCards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setSessionCompleted(loadedCards.length === 0);
    } catch (err: any) {
      console.error('Failed to load flashcards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    playClick(soundEnabled);
    setIsFlipped(!isFlipped);
  };

  const handleReview = async (rating: 'again' | 'good' | 'easy') => {
    if (cards.length === 0) return;
    const currentCard = cards[currentIndex];

    let xp = 20;
    if (rating === 'again') {
      xp = 10;
      playClick(soundEnabled);
    } else if (rating === 'good') {
      xp = 50;
      playLaserShot(soundEnabled);
    } else {
      xp = 100;
      playComboMultiplier(soundEnabled);
    }

    addCredits(xp);
    setEarnedXp((prev) => prev + xp);
    setReviewedCount((prev) => prev + 1);

    try {
      await api.reviewFlashcard(currentCard.id, rating);
    } catch (e) {
      console.warn('Review sync warning:', e);
    }

    // Advance to next card or complete
    if (currentIndex + 1 < cards.length) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setSessionCompleted(true);
      playVictoryFanfare(soundEnabled);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00E5FF', '#FF2E93', '#C6FF00', '#FFD60A']
      });
      refreshProfile();
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Pixel size="default" state="thinking" speechText="CHARGING HOLOGRAPHIC EMITTERS..." />
        <div className="font-arcade text-xs text-cyber-yellow animate-pulse tracking-widest">
          PROJECTING NEURAL HOLO-DECK...
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 pb-32">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => {
            playClick(soundEnabled);
            if (districtId && num) {
              navigate(`/district/${districtId}`);
            } else {
              navigate('/');
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-card hover:bg-cyber-base border-2 border-black shadow-brutal-cyan text-xs font-arcade text-cyber-cyan btn-arcade"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>EXIT HOLO-DECK</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-cyber-card border border-cyber-yellow text-xs font-arcade text-cyber-yellow">
            <Layers className="w-3.5 h-3.5 inline mr-1" />
            CARD {cards.length > 0 ? currentIndex + 1 : 0} / {cards.length}
          </span>
        </div>
      </div>

      {/* Main Hologram Card Container */}
      {!sessionCompleted && currentCard ? (
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="w-full h-2.5 rounded-full bg-cyber-base border-2 border-black overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-yellow transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
            />
          </div>

          {/* 3D Holographic Card */}
          <div className="perspective-1000 py-4">
            <motion.div
              onClick={handleFlip}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="w-full min-h-[380px] sm:min-h-[420px] rounded-3xl bg-cyber-card border-4 border-black p-8 sm:p-12 shadow-brutal-yellow cursor-pointer relative preserve-3d flex flex-col justify-between"
            >
              {/* FRONT FACE */}
              <div
                className={`absolute inset-0 p-8 sm:p-12 flex flex-col justify-between backface-hidden ${
                  isFlipped ? 'pointer-events-none' : ''
                }`}
              >
                <div className="flex items-center justify-between border-b-2 border-black/40 pb-4">
                  <span className="px-3 py-1 rounded bg-cyber-base border border-cyber-yellow text-xs font-arcade text-cyber-yellow">
                    {currentCard.category ? currentCard.category.toUpperCase() : 'CORE CONCEPT'}
                  </span>
                  <span className="text-[10px] font-arcade text-cyber-muted">
                    {currentCard.slide_ref || currentCard.slide_reference || 'SLIDE VERBATIM'}
                  </span>
                </div>

                <div className="my-auto py-6 text-center space-y-4">
                  <h2 className="font-arcade text-xl sm:text-2xl text-cyber-text text-neon-yellow leading-relaxed">
                    {currentCard.front}
                  </h2>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs font-arcade text-cyber-muted pt-4 border-t-2 border-black/40">
                  <RotateCw className="w-4 h-4 animate-spin-slow" />
                  <span>CLICK OR TAP SPACEBAR TO REVEAL NEURAL CIPHER</span>
                </div>
              </div>

              {/* BACK FACE */}
              <div
                className={`absolute inset-0 p-8 sm:p-12 flex flex-col justify-between backface-hidden rotate-y-180 bg-cyber-base rounded-3xl border-4 border-black ${
                  !isFlipped ? 'pointer-events-none' : ''
                }`}
              >
                <div className="flex items-center justify-between border-b-2 border-black/40 pb-4">
                  <span className="px-3 py-1 rounded bg-cyber-card border border-cyber-lime text-xs font-arcade text-cyber-lime">
                    NEURAL DECRYPTED
                  </span>
                  <span className="text-[10px] font-arcade text-cyber-lime">
                    {currentCard.slide_ref || currentCard.slide_reference || 'GROUNDED FACT'}
                  </span>
                </div>

                <div className="my-auto py-6 space-y-4">
                  <div className="font-sans text-base sm:text-lg text-cyber-text font-medium leading-relaxed">
                    {currentCard.back}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] font-arcade text-cyber-muted pt-4 border-t-2 border-black/40">
                  <span>SELECT RECALL ACCURACY BELOW</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Spaced Repetition Response Controls */}
          {isFlipped ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-3 sm:gap-4"
            >
              <button
                onClick={() => handleReview('again')}
                className="py-3.5 sm:py-4 px-2 sm:px-4 rounded-2xl bg-cyber-pink hover:bg-pink-600 text-white font-arcade text-xs border-3 border-black shadow-brutal-pink btn-arcade flex flex-col items-center gap-1 text-center"
              >
                <span className="font-extrabold">AGAIN</span>
                <span className="text-[10px] opacity-80">+10 XP • RESET</span>
              </button>

              <button
                onClick={() => handleReview('good')}
                className="py-3.5 sm:py-4 px-2 sm:px-4 rounded-2xl bg-cyber-cyan hover:bg-cyan-400 text-black font-arcade text-xs border-3 border-black shadow-brutal-cyan btn-arcade flex flex-col items-center gap-1 text-center"
              >
                <span className="font-extrabold">GOOD</span>
                <span className="text-[10px] opacity-80">+50 XP • IN 1D</span>
              </button>

              <button
                onClick={() => handleReview('easy')}
                className="py-3.5 sm:py-4 px-2 sm:px-4 rounded-2xl bg-cyber-lime hover:bg-lime-400 text-black font-arcade text-xs border-3 border-black shadow-brutal-lime btn-arcade flex flex-col items-center gap-1 text-center"
              >
                <span className="font-extrabold">EASY</span>
                <span className="text-[10px] opacity-80">+100 XP • IN 4D</span>
              </button>
            </motion.div>
          ) : (
            <div className="text-center">
              <button
                onClick={handleFlip}
                className="w-full py-4 rounded-2xl bg-cyber-yellow hover:bg-yellow-400 text-black font-arcade text-xs border-3 border-black shadow-brutal-yellow btn-arcade"
              >
                REVEAL ANSWER (SPACEBAR)
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Session Completed Victory Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl bg-cyber-card border-4 border-black p-8 sm:p-12 shadow-brutal-lime text-center space-y-6"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-cyber-lime border-4 border-black shadow-[4px_4px_0_#000] flex items-center justify-center">
            <Trophy className="w-12 h-12 text-black" />
          </div>

          <div className="space-y-2">
            <h2 className="font-arcade text-xl sm:text-3xl text-cyber-text text-neon-lime">
              HOLO-DECK ROUTINE COMPLETE!
            </h2>
            <p className="font-sans text-xs sm:text-sm text-cyber-muted max-w-md mx-auto">
              All holographic cards in this matrix sector reviewed and refreshed.
            </p>
          </div>

          <div className="inline-flex items-center gap-6 p-4 rounded-2xl bg-cyber-base border-2 border-black font-arcade text-xs">
            <div>
              <div className="text-cyber-muted text-[10px]">CARDS MASTERED</div>
              <div className="text-cyber-cyan text-sm">{reviewedCount}</div>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div>
              <div className="text-cyber-muted text-[10px]">XP CREDITS EARNED</div>
              <div className="text-cyber-yellow text-sm">+{earnedXp} CREDITS</div>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                playClick(soundEnabled);
                loadCards();
              }}
              className="px-6 py-3 rounded-xl bg-cyber-base hover:bg-cyber-card border-2 border-black shadow-[3px_3px_0_#000] text-xs font-arcade text-cyber-text btn-arcade"
            >
              REPLAY MATRIX
            </button>

            {districtId && (
              <button
                onClick={() => {
                  playLaserShot(soundEnabled);
                  navigate(`/district/${districtId}`);
                }}
                className="px-6 py-3 rounded-xl bg-cyber-lime hover:bg-lime-400 text-black font-arcade text-xs border-2 border-black shadow-brutal-lime btn-arcade"
              >
                RETURN TO DISTRICT
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
