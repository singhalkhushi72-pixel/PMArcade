import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, BookOpen, Layers, Swords, Send, Sparkles, 
  Lightbulb, ShieldCheck, FileText, Bot, RotateCcw, AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';
import { Level, Flashcard, Question } from '../types';
import { Pixel } from '../components/mascot/Pixel';
import { useArcadeStore } from '../stores/useArcadeStore';
import { playClick, playLaserShot } from '../utils/audio';

export const StoryNode: React.FC = () => {
  const { id: districtId, num } = useParams<{ id: string; num: string }>();
  const navigate = useNavigate();
  const { soundEnabled } = useArcadeStore();

  const [levelData, setLevelData] = useState<(Level & { flashcards: Flashcard[]; questions: Question[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'law' | 'analogy' | 'case' | 'tactics'>('law');
  
  // Pixel Comms AI tutor chat state
  const [pixelQuery, setPixelQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'pixel'; text: string }>>([]);
  const [isAskingPixel, setIsAskingPixel] = useState(false);

  useEffect(() => {
    if (districtId && num) {
      loadNode();
    }
  }, [districtId, num]);

  const loadNode = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const levelNumber = parseInt(num || '1', 10);
      if (isNaN(levelNumber)) {
        throw new Error(`Invalid node identifier: "${num}". Expected a numeric node index.`);
      }

      const data = await api.getLevel(districtId!, levelNumber);
      setLevelData(data);
      // Pre-seed greeting from Pixel
      setChatMessages([
        {
          sender: 'pixel',
          text: `Neural comms online for Node #${levelNumber}: ${data.title}! Ask me anything about this concept or the lecture slides!`
        }
      ]);
    } catch (err: any) {
      console.error('Failed to load node briefing:', err);
      setErrorMessage(err.message || "Pixel couldn't read this deck, try again");
    } finally {
      setLoading(false);
    }
  };

  const handleAskPixel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pixelQuery.trim() || !levelData || isAskingPixel) return;

    const userText = pixelQuery.trim();
    setPixelQuery('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsAskingPixel(true);

    try {
      const res = await api.askPixel(levelData.id, districtId!, userText);
      setChatMessages((prev) => [...prev, { sender: 'pixel', text: res.answer }]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev, 
        { sender: 'pixel', text: '⚡ Transmission glitch! Could not reach satellite node. Try again.' }
      ]);
    } finally {
      setIsAskingPixel(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Pixel size="default" state="thinking" speechText="DECRYPTING NODE BRIEFING..." />
        <div className="font-arcade text-xs text-cyber-cyan animate-pulse tracking-widest">
          PARSING SLIDE ARCHIVES...
        </div>
      </div>
    );
  }

  // Visible, unmissable error state with retry button
  if (errorMessage || !levelData) {
    return (
      <div className="max-w-lg mx-auto my-16 p-8 rounded-3xl bg-cyber-card border-4 border-cyber-pink shadow-brutal-pink text-center space-y-6">
        <div className="flex justify-center">
          <Pixel
            size="md"
            state="alarm"
            speechText="Pixel couldn't read this deck, try again!"
          />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyber-base border border-cyber-pink text-xs font-arcade text-cyber-pink">
            <AlertTriangle className="w-4 h-4" />
            <span>COMMUNICATION INTERRUPTED</span>
          </div>
          <h2 className="font-arcade text-base sm:text-lg text-cyber-text text-neon-pink">
            Pixel couldn't read this deck, try again
          </h2>
          <p className="font-sans text-xs text-cyber-muted max-w-sm mx-auto leading-relaxed">
            {errorMessage || 'The neural mainframe failed to sync this node from the slide deck.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              playClick(soundEnabled);
              loadNode();
            }}
            className="px-6 py-3 rounded-xl bg-cyber-pink hover:bg-pink-600 text-white font-arcade text-xs border-2 border-black shadow-brutal-pink btn-arcade flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>RETRY CONNECTION</span>
          </button>

          <button
            onClick={() => {
              playClick(soundEnabled);
              navigate(`/district/${districtId}`);
            }}
            className="px-5 py-3 rounded-xl bg-cyber-base hover:bg-cyber-card text-cyber-cyan font-arcade text-xs border-2 border-black shadow-[3px_3px_0_#000] btn-arcade flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO DISTRICT</span>
          </button>
        </div>
      </div>
    );
  }

  const nodeNumber = levelData.order_num ?? levelData.level_number ?? num;
  const slideRef = levelData.slide_refs || levelData.slide_reference || 'SLIDE REFERENCE';
  const lawText = levelData.explanation || levelData.content || 'Core product principle defined in presentation.';
  const summaryText = levelData.slide_refs ? `Grounding: ${levelData.slide_refs}` : (levelData.summary || levelData.title);
  const analogyText = levelData.analogy || "Imagine building a cyber-deck: if you don't calibrate your cooling loops (core assumptions), cranking the throttle (scaling) will fry your mainframe!";
  const benchmarkText = levelData.product_example || levelData.real_world_example || "How high-growth companies like Stripe, Linear, and Figma applied this rule to scale without sacrificing quality.";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 pb-32">
      {/* Navigation & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => {
            playClick(soundEnabled);
            navigate(`/district/${districtId}`);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-card hover:bg-cyber-base border-2 border-black shadow-brutal-cyan text-xs font-arcade text-cyber-cyan btn-arcade"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>CIRCUIT MAP</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded bg-cyber-card border border-cyber-pink text-xs font-arcade text-cyber-pink">
            NODE #{nodeNumber}
          </span>
          <span className="px-3 py-1 rounded bg-cyber-card border border-cyber-lime text-xs font-arcade text-cyber-lime">
            {slideRef}
          </span>
        </div>
      </div>

      {/* Main Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Briefing Terminal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-cyber-card border-4 border-black p-6 sm:p-8 shadow-brutal-cyan space-y-6 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-black/40 pb-4">
              <div>
                <span className="text-[10px] font-arcade text-cyber-cyan uppercase tracking-widest">
                  TACTICAL BRIEFING
                </span>
                <h1 className="font-arcade text-lg sm:text-2xl text-cyber-text text-neon-cyan mt-1">
                  {levelData.title}
                </h1>
              </div>

              {/* Mode Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-cyber-base border-2 border-black">
                <button
                  onClick={() => {
                    playClick(soundEnabled);
                    setActiveTab('law');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-arcade transition-all ${
                    activeTab === 'law'
                      ? 'bg-cyber-cyan text-black font-bold shadow-[2px_2px_0_#000]'
                      : 'text-cyber-muted hover:text-white'
                  }`}
                >
                  LAW
                </button>
                <button
                  onClick={() => {
                    playClick(soundEnabled);
                    setActiveTab('analogy');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-arcade transition-all ${
                    activeTab === 'analogy'
                      ? 'bg-cyber-pink text-white font-bold shadow-[2px_2px_0_#000]'
                      : 'text-cyber-muted hover:text-white'
                  }`}
                >
                  ANALOGY
                </button>
                <button
                  onClick={() => {
                    playClick(soundEnabled);
                    setActiveTab('case');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-arcade transition-all ${
                    activeTab === 'case'
                      ? 'bg-cyber-lime text-black font-bold shadow-[2px_2px_0_#000]'
                      : 'text-cyber-muted hover:text-white'
                  }`}
                >
                  WAR-STORY
                </button>
                <button
                  onClick={() => {
                    playClick(soundEnabled);
                    setActiveTab('tactics');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-arcade transition-all ${
                    activeTab === 'tactics'
                      ? 'bg-cyber-yellow text-black font-bold shadow-[2px_2px_0_#000]'
                      : 'text-cyber-muted hover:text-white'
                  }`}
                >
                  TACTICS
                </button>
              </div>
            </div>

            {/* Dynamic Card Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'law' && (
                <motion.div
                  key="law"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-xs font-arcade text-cyber-cyan">
                    <ShieldCheck className="w-4 h-4" />
                    <span>FOUNDATIONAL LAW OF THE PRODUCT</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-cyber-base border-2 border-black text-cyber-text font-sans text-sm sm:text-base leading-relaxed">
                    {lawText}
                  </div>

                  <div className="p-4 rounded-xl bg-cyber-base/60 border border-cyber-cyan/30 flex items-start gap-3">
                    <FileText className="w-4 h-4 text-cyber-cyan shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs">
                      <div className="font-arcade text-cyber-cyan">SLIDE GROUNDING</div>
                      <p className="text-cyber-muted font-sans">{summaryText}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'analogy' && (
                <motion.div
                  key="analogy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-xs font-arcade text-cyber-pink">
                    <Lightbulb className="w-4 h-4" />
                    <span>NEON METAPHOR // RELATABLE ANALOGY</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-cyber-base border-2 border-cyber-pink/50 text-cyber-text font-sans text-sm sm:text-base leading-relaxed">
                    {analogyText}
                  </div>
                </motion.div>
              )}

              {activeTab === 'case' && (
                <motion.div
                  key="case"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-xs font-arcade text-cyber-lime">
                    <Sparkles className="w-4 h-4" />
                    <span>FIELD WAR-STORY // REAL TECH BENCHMARK</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-cyber-base border-2 border-cyber-lime/50 text-cyber-text font-sans text-sm sm:text-base leading-relaxed">
                    {benchmarkText}
                  </div>
                </motion.div>
              )}

              {activeTab === 'tactics' && (
                <motion.div
                  key="tactics"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-xs font-arcade text-cyber-yellow">
                    <BookOpen className="w-4 h-4" />
                    <span>TACTICAL PM CHECKLIST</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-cyber-base border-2 border-cyber-yellow/50 space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-md bg-cyber-yellow text-black font-arcade text-xs flex items-center justify-center shrink-0">1</span>
                      <p className="text-xs sm:text-sm text-cyber-text font-sans">Audit lecture slide definitions and identify key metric trade-offs.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-md bg-cyber-yellow text-black font-arcade text-xs flex items-center justify-center shrink-0">2</span>
                      <p className="text-xs sm:text-sm text-cyber-text font-sans">Run a scenario check: would this satisfy customer and tech feasibility?</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-md bg-cyber-yellow text-black font-arcade text-xs flex items-center justify-center shrink-0">3</span>
                      <p className="text-xs sm:text-sm text-cyber-text font-sans">Memorize the core formula for the upcoming Boss Battle!</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Action Navigation */}
            <div className="pt-4 border-t-2 border-black/40 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  playClick(soundEnabled);
                  navigate(`/district/${districtId}/node/${nodeNumber}/cards`);
                }}
                className="px-5 py-3 rounded-xl bg-cyber-base hover:bg-cyber-card border-2 border-black shadow-[3px_3px_0_#000] text-xs font-arcade text-cyber-yellow btn-arcade inline-flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>STUDY HOLO-CARDS ({levelData.flashcards?.length || 5})</span>
              </button>

              <button
                onClick={() => {
                  playLaserShot(soundEnabled);
                  navigate(`/district/${districtId}/node/${nodeNumber}/battle`);
                }}
                className="px-6 py-3 rounded-xl bg-cyber-pink hover:bg-pink-600 text-white font-arcade text-xs border-2 border-black shadow-brutal-pink btn-arcade inline-flex items-center gap-2"
              >
                <Swords className="w-4 h-4 stroke-[2.5]" />
                <span>COMMENCE BATTLE QUIZ ({levelData.questions?.length || 5})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: "PIXEL COMMS" AI Tutor Terminal */}
        <div className="space-y-4">
          <div className="rounded-3xl bg-cyber-card border-4 border-black p-5 sm:p-6 shadow-brutal-pink flex flex-col h-[560px]">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-black/40 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyber-pink" />
                <span className="font-arcade text-xs text-cyber-pink">PIXEL COMMS // AI TUTOR</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-cyber-lime animate-pulse" />
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 text-xs font-sans">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl border-2 border-black ${
                    msg.sender === 'user'
                      ? 'bg-cyber-pink text-white ml-6 shadow-[2px_2px_0_#000]'
                      : 'bg-cyber-base text-cyber-text mr-4 shadow-[2px_2px_0_#000] border-cyber-cyan/40'
                  }`}
                >
                  <div className="text-[10px] font-arcade opacity-75 mb-1">
                    {msg.sender === 'user' ? 'YOU' : 'PIXEL (AI)'}
                  </div>
                  <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                </div>
              ))}

              {isAskingPixel && (
                <div className="p-3 rounded-2xl bg-cyber-base border-2 border-black text-cyber-cyan text-xs font-arcade animate-pulse">
                  PIXEL SEARCHING SLIDE ARCHIVE...
                </div>
              )}
            </div>

            {/* Mascot Avatar Hint */}
            <div className="py-2 border-t border-black/30 flex items-center gap-3">
              <Pixel size="small" state={isAskingPixel ? 'thinking' : 'idle'} />
              <div className="text-[10px] font-arcade text-cyber-muted">
                {isAskingPixel ? "Analyzing slide references..." : "Ask me anything about this node!"}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleAskPixel} className="pt-2 flex gap-2">
              <input
                type="text"
                value={pixelQuery}
                onChange={(e) => setPixelQuery(e.target.value)}
                placeholder="Ask Pixel about this concept..."
                className="flex-1 px-3 py-2 rounded-xl bg-cyber-base border-2 border-black text-xs text-cyber-text placeholder:text-zinc-600 focus:outline-none focus:border-cyber-pink"
              />
              <button
                type="submit"
                disabled={isAskingPixel || !pixelQuery.trim()}
                className="px-3.5 py-2 rounded-xl bg-cyber-pink disabled:opacity-50 text-white font-arcade text-xs border-2 border-black shadow-[2px_2px_0_#000] btn-arcade"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
