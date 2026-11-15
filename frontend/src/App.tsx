import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ParallaxStarfield } from './components/arcade/ParallaxStarfield';
import { CrtOverlay } from './components/arcade/CrtOverlay';
import { ArcadeHeader } from './components/layout/ArcadeHeader';
import { ArcadeBottomNav } from './components/layout/ArcadeBottomNav';
import { DistrictMap } from './pages/DistrictMap';
import { DistrictView } from './pages/DistrictView';
import { StoryNode } from './pages/StoryNode';
import { HoloDeck } from './pages/HoloDeck';
import { QuizArena } from './pages/QuizArena';
import { BossChamber } from './pages/BossChamber';
import { DeckTerminal } from './pages/DeckTerminal';
import { ArcadeLeaderboard } from './pages/ArcadeLeaderboard';
import { useArcadeStore } from './stores/useArcadeStore';

export const App: React.FC = () => {
  const { crtEnabled, fetchProfile } = useArcadeStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-cyber-base text-cyber-text font-sans antialiased selection:bg-cyber-pink selection:text-white overflow-x-hidden">
        {/* Animated Parallax 2.5D Starfield / Cyber City Skyline */}
        <ParallaxStarfield />

        {/* Optional Retro CRT Scanline & Curved Beam Overlay */}
        {crtEnabled && <CrtOverlay />}

        {/* Global Retro Arcade Header */}
        <ArcadeHeader />

        {/* Dynamic Route Viewport */}
        <main className="relative z-10 w-full min-h-[calc(100vh-80px)]">
          <Routes>
            {/* Overworld Map of Arcade Districts */}
            <Route path="/" element={<DistrictMap />} />

            {/* Ingestion Terminal: Upload PPTX/PDF and generate district */}
            <Route path="/upload" element={<DeckTerminal />} />

            {/* Motherboard Node Map for a District */}
            <Route path="/district/:id" element={<DistrictView />} />

            {/* Node Story Card Briefing Terminal */}
            <Route path="/district/:id/node/:num" element={<StoryNode />} />

            {/* Node-scoped Holographic Spaced Repetition Cards */}
            <Route path="/district/:id/node/:num/cards" element={<HoloDeck />} />

            {/* Combat Arena Quiz */}
            <Route path="/district/:id/node/:num/battle" element={<QuizArena />} />

            {/* District Apex Threat: Boss Chamber Encounter */}
            <Route path="/district/:id/boss" element={<BossChamber />} />

            {/* Global Holographic Flashcards Matrix Sector */}
            <Route path="/matrix" element={<HoloDeck />} />

            {/* Hall of Fame & Retro Badges */}
            <Route path="/highscores" element={<ArcadeLeaderboard />} />
            <Route path="/profile" element={<ArcadeLeaderboard />} />

            {/* Fallback to Overworld */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Mobile Arcade Bottom Navigation */}
        <ArcadeBottomNav />
      </div>
    </BrowserRouter>
  );
};

export default App;
