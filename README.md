# 🕹️ PM ARCADE // Product City 2084

> **A Cyberpunk Retro-Arcade Study Game for Product Management & University Courses.**
> Transform lecture slides (`.pptx` / `.pdf`) into playable arcade districts with boss fights, combo multipliers, 3D holographic cards, and Pixel the AI robot sidekick.

---

## ⚡ ANTI-GOALS (What this is NOT)
- ❌ **NOT an LMS.**
- ❌ **NOT a SaaS dashboard.**
- ❌ **NO white backgrounds or generic purple-blue gradients.**
- ❌ **NO boring cards-in-a-grid layouts.**

Every screen looks and feels like an indie cyberpunk arcade machine with neo-brutalist thick borders, CRT scanlines, 2.5D mouse-reactive starfield, floating combat text, 8-bit Web Audio synthesizer, and animated SVG boss monsters!

---

## 🎮 CORE GAMEPLAY LOOP

```
       ┌────────────────────────┐
       │   INSERT SLIDE DECK    │ (.pptx / .pdf)
       └───────────┬────────────┘
                   ▼
       ┌────────────────────────┐
       │ GEMINI AI GENERATION   │ (Districts, Nodes, Cards, Boss)
       └───────────┬────────────┘
                   ▼
       ┌────────────────────────┐
       │   PRODUCT CITY MAP     │ (Overworld 2.5D Arcade Cabinets)
       └───────────┬────────────┘
                   ▼
    ┌──────────────┴──────────────┐
    ▼                             ▼
┌───────────────────┐     ┌───────────────────┐
│ BRIEFING TERMINAL │     │ 3D HOLO-DECK      │
│ (Core Law, Analogy│     │ (SM-2 Spaced      │
│  & Pixel AI Chat) │     │  Repetition)      │
└─────────┬─────────┘     └─────────┬─────────┘
          └──────────────┬──────────┘
                         ▼
             ┌─────────────────────┐
             │ COMBAT QUIZ ARENA   │ (Combos, Shields & Timers)
             └───────────┬─────────┘
                         ▼
             ┌─────────────────────┐
             │    BOSS CHAMBER     │ (Slay "THE SCOPE CREEP")
             └─────────────────────┘
```

1. **INSERT DECK (`/upload`)**: Drag-and-drop course slides (`.pptx` or `.pdf`). Zero native dependencies. Slide text, notes, and diagrams are parsed and fed to Google's Gemini API to generate:
   - 4-8 bite-sized level nodes grounded strictly in the slides.
   - Relatable analogies and real-world tech benchmarks (Stripe, Figma, Apple).
   - 3D holographic flashcards.
   - Multi-format combat questions (MCQ, True/False, Scenario, Fill-in-the-blank).
   - A themed Apex District Boss Monster with unique weakness and attack power.
2. **DISTRICT OVERWORLD (`/`)**: 2.5D parallax map featuring neon arcade cabinets, player callsign, shields meter, and streak counter.
3. **BRIEFING TERMINAL (`/district/:id/node/:num`)**: Card-by-card tactical breakdown (Core Law, Cyber Analogy, War-Story, PM Tactics) + live **Pixel Comms** AI tutor chat.
4. **HOLO-DECK (`/matrix` or `/district/:id/node/:num/cards`)**: 3D holographic card flip animation with SM-2 spaced repetition (`Again`, `Good`, `Easy`) and sound effects.
5. **QUIZ ARENA (`/district/:id/node/:num/battle`)**: High-stakes combat quiz with floating combat damage numbers (`-25 HP!`), combo multipliers (`COMBO x3!`), and cyber shield loss on wrong answers.
6. **BOSS CHAMBER (`/district/:id/boss`)**: Full-screen encounter with animated multi-eyed boss monster (`BossMonsterAvatar`), live health bar depletion, screen shake, and victory fanfare.
7. **HALL OF FAME (`/highscores`)**: 12 retro pixel badges (`FIRST BLOOD`, `COMBO MASTER`, `SLAYER OF SCOPE`, etc.) and global arcade leaderboard.

---

## 🎨 ART DIRECTION & DESIGN TOKENS

- **Background**: Near-black navy (`#0B0620`)
- **Electric Pink**: `#FF2E93`
- **Acid Lime**: `#C6FF00`
- **Cyan Cyber**: `#00E5FF`
- **Sunset Orange**: `#FF8A00`
- **Hot Yellow**: `#FFD60A`
- **Typography**: `Press Start 2P`, `VT323`, `Bungee`, `Space Grotesk`
- **Audio**: Pure Web Audio API 8-bit synthesizer (laser shots, boss hit sub-bass, shield damage, combo chimes, fanfare). Zero external mp3 dependencies.
- **Mascot**: "Pixel", interactive animated SVG robot sidekick with 6 mood states (`idle`, `cheering`, `thinking`, `sad`, `dancing`, `alarm`).

---

## 🚀 GETTING STARTED

### Prerequisites
- Node.js v18+ (tested on Windows Node v20.18.0)

### Quick Launch

1. **Configure Gemini API Key (Optional)**:
   Edit `pm-arcade/backend/.env`:
   ```env
   PORT=3005
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(If no key is provided, PM ARCADE automatically runs in Offline Smart Mode with pre-seeded Foundry syllabus content!)*

2. **Run Backend (which serves API + built Frontend)**:
   ```bash
   cd pm-arcade/backend
   node dist/index.js
   ```
   Open your browser to: **`http://localhost:3005`**

3. **Frontend Development Server (with hot reload)**:
   ```bash
   cd pm-arcade/frontend
   npm run dev
   ```
   Access on `http://localhost:5174` (proxies `/api` to port 3005).

---

## 🏆 PRE-SEEDED CONTENT: DISTRICT 0
PM Arcade comes pre-loaded with **"District 0: The Cyber Foundry"**:
- **Boss**: `THE SCOPE CREEP` (Eater of Roadmaps & Destroyer of Sprints)
- **Node 1**: Active Recall vs. Passive Reading (Slides 2-5)
- **Node 2**: Spaced Repetition & The Ebbinghaus Decay Curve (Slides 6-9)
- **Node 3**: The Feynman Model & Mental Schemas (Slides 10-12)
- **Node 4**: Cognitive Load & Dual Coding (Slides 13-16)
- **12 Retro Trophies** ready to unlock!
