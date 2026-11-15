import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Upload, FileUp, Sparkles, CheckCircle2, 
  AlertCircle, Cpu, Zap, FolderArchive, Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { Pixel } from '../components/mascot/Pixel';
import { useArcadeStore } from '../stores/useArcadeStore';
import { playClick, playInsertCoin, playVictoryFanfare } from '../utils/audio';

export const DeckTerminal: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { soundEnabled, refreshProfile } = useArcadeStore();

  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const processingSteps = [
    'DECRYPTING SLIDE ARCHIVE & EXTRACTING NOTES...',
    'ISOLATING CORE PRODUCT LAWS & METRICS...',
    'GEMINI NEURAL ENGINE GENERATING DISTRICT NODES...',
    'FORGING 3D HOLO-CARDS & TACTICAL QUIZZES...',
    'BREEDING DISTRICT APEX BOSS MONSTER...',
    'DISTRICT ONLINE! PREPARING ENTRY...'
  ];

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const valid = Array.from(newFiles).filter((f) => 
      f.name.endsWith('.pptx') || f.name.endsWith('.pdf')
    );
    if (valid.length === 0) {
      alert('Please upload .pptx or .pdf presentation files.');
      return;
    }
    setFiles((prev) => [...prev, ...valid]);
    playClick(soundEnabled);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    playClick(soundEnabled);
  };

  const handleStartUpload = async () => {
    if (files.length === 0 || uploading) return;

    setUploading(true);
    setError(null);
    setCurrentStep(0);
    playInsertCoin(soundEnabled);

    // Simulate retro progress steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < processingSteps.length - 2) {
          return prev + 1;
        }
        return prev;
      });
    }, 2800);

    try {
      const res = await api.uploadFiles(files);
      clearInterval(stepInterval);
      setCurrentStep(processingSteps.length - 1);

      playVictoryFanfare(soundEnabled);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00E5FF', '#FF2E93', '#C6FF00', '#FFD60A']
      });

      refreshProfile();

      setTimeout(() => {
        if (res.districts && res.districts.length > 0) {
          navigate(`/district/${res.districts[res.districts.length - 1].id}`);
        } else {
          navigate('/');
        }
      }, 1500);
    } catch (err: any) {
      clearInterval(stepInterval);
      setError(err.message || 'Neural translation failed. Check API key in backend/.env');
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 pb-32">
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

        <span className="px-3 py-1 rounded bg-cyber-card border border-cyber-pink text-xs font-arcade text-cyber-pink">
          TERMINAL // DECK INGESTION
        </span>
      </div>

      {/* Main Terminal Card */}
      <div className="rounded-3xl bg-cyber-card border-4 border-black p-6 sm:p-10 shadow-brutal-pink space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyber-base border border-cyber-cyan text-xs font-arcade text-cyber-cyan">
              <Cpu className="w-3.5 h-3.5" />
              <span>CARTRIDGE PORT // LECTURE SLIDES</span>
            </div>
            <h1 className="font-arcade text-xl sm:text-3xl text-cyber-text text-neon-pink">
              INSERT SLIDE DECK
            </h1>
            <p className="font-sans text-xs sm:text-sm text-cyber-muted max-w-lg leading-relaxed">
              Feed your course slides (.pptx or .pdf) into the terminal. Gemini will extract every rule, generate a playable district, and spawn an apex Boss Monster!
            </p>
          </div>

          <div className="shrink-0">
            <Pixel
              size="default"
              state={uploading ? 'thinking' : files.length > 0 ? 'cheering' : 'idle'}
              speechText={
                uploading
                  ? "Transcribing slides to neural topography..."
                  : files.length > 0
                  ? "Cartridges loaded! Press Launch to generate district!"
                  : "Drag your PPTX or PDF slides right here!"
              }
            />
          </div>
        </div>

        {/* Dropzone */}
        {!uploading ? (
          <div className="space-y-4">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-2xl border-4 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-cyber-lime bg-cyber-lime/10 shadow-brutal-lime'
                  : 'border-black bg-cyber-base/70 hover:bg-cyber-base hover:border-cyber-pink shadow-[4px_4px_0_#000]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pptx,.pdf"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />

              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-cyber-pink border-3 border-black shadow-[3px_3px_0_#000] flex items-center justify-center text-white">
                  <FileUp className="w-8 h-8 stroke-[2.5]" />
                </div>

                <div className="space-y-1">
                  <div className="font-arcade text-xs sm:text-sm text-cyber-text text-neon-cyan">
                    DRAG & DROP .PPTX OR .PDF CARTRIDGES HERE
                  </div>
                  <div className="text-xs text-cyber-muted font-sans">
                    or click to browse local filesystem
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-black/60 border border-cyber-muted/30 text-[10px] font-arcade text-cyber-muted">
                  <span>MAXIMUM ENCODING: 50MB PER DECK</span>
                </div>
              </div>
            </div>

            {/* Selected File Chips */}
            {files.length > 0 && (
              <div className="space-y-2">
                <div className="font-arcade text-xs text-cyber-lime">
                  STAGED SLIDE DECKS ({files.length}):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {files.map((file, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-cyber-base border-2 border-black flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FolderArchive className="w-4 h-4 text-cyber-pink shrink-0" />
                        <span className="truncate text-cyber-text font-medium">{file.name}</span>
                        <span className="text-[10px] text-cyber-muted shrink-0">
                          ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(i);
                        }}
                        className="text-cyber-pink hover:text-white font-arcade text-[10px] px-2 py-0.5 rounded bg-black"
                      >
                        REMOVE
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error banner with Pixel alert and Retry */}
            {error && (
              <div className="p-5 rounded-2xl bg-cyber-pink/20 border-3 border-cyber-pink space-y-3">
                <div className="flex items-center gap-3">
                  <Pixel size="sm" state="alarm" />
                  <div>
                    <h3 className="font-arcade text-xs text-cyber-pink font-bold">
                      Pixel couldn't read this deck, try again
                    </h3>
                    <p className="font-sans text-xs text-cyber-muted mt-0.5">
                      {error}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleStartUpload}
                    className="px-4 py-2 rounded-xl bg-cyber-pink hover:bg-pink-600 text-white font-arcade text-[10px] border-2 border-black shadow-[2px_2px_0_#000] btn-arcade flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>RETRY SYNTHESIS</span>
                  </button>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  // Fallback: create mock dummy file for testing without local pptx
                  const dummyBlob = new Blob(['Lecture 1: Product Strategy and North Star Metrics'], { type: 'text/plain' });
                  const dummyFile = new File([dummyBlob], 'Product_Strategy_Lecture_1.pdf', { type: 'application/pdf' });
                  setFiles((prev) => [...prev, dummyFile]);
                }}
                className="px-4 py-2.5 rounded-xl bg-cyber-base hover:bg-cyber-card border-2 border-black text-[10px] font-arcade text-cyber-yellow btn-arcade"
              >
                + ADD SAMPLE COURSE FILE
              </button>

              <button
                disabled={files.length === 0}
                onClick={handleStartUpload}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-cyber-pink hover:bg-pink-600 disabled:opacity-50 text-white font-arcade text-xs border-3 border-black shadow-brutal-pink btn-arcade flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 stroke-[2.5]" />
                <span>SYNTHESIZE ARCADE DISTRICT</span>
              </button>
            </div>
          </div>
        ) : (
          /* Animated Processing State */
          <div className="py-8 space-y-6 text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-cyber-pink/20 border-4 border-cyber-pink flex items-center justify-center text-cyber-pink animate-pulse">
                <Sparkles className="w-8 h-8 animate-spin-slow" />
              </div>

              <h2 className="font-arcade text-lg sm:text-xl text-cyber-text text-neon-cyan">
                {processingSteps[currentStep]}
              </h2>

              <p className="font-sans text-xs text-cyber-muted max-w-sm mx-auto">
                Neural parsing slides with Gemini AI. Constructing levels, boss monster, and spaced repetition cards...
              </p>
            </div>

            {/* Cyberpunk Progress Bar */}
            <div className="max-w-md mx-auto space-y-1.5">
              <div className="w-full h-4 rounded-full bg-cyber-base border-2 border-black overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyber-cyan via-cyber-pink to-cyber-lime transition-all duration-500"
                  style={{
                    width: `${((currentStep + 1) / processingSteps.length) * 100}%`
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-arcade text-cyber-muted">
                <span>PHASE {currentStep + 1} OF {processingSteps.length}</span>
                <span className="text-cyber-lime">
                  {Math.round(((currentStep + 1) / processingSteps.length) * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
