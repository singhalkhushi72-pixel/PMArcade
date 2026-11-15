import fs from 'fs';
import path from 'path';
import { District, Level, Flashcard, Question, BossMonster, PlayerArcadeProfile, RetroAchievement } from '../types.js';

interface ArcadeDatabase {
  districts: District[];
  levels: Level[];
  flashcards: Flashcard[];
  questions: Question[];
  profile: PlayerArcadeProfile;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'arcade_db.json');

const INITIAL_RETRO_ACHIEVEMENTS: RetroAchievement[] = [
  { id: 'first_insert_coin', title: 'INSERT COIN', desc: 'Conquer your first district arcade level', badge_code: 'ACH_01', icon: '🕹️', unlocked: false },
  { id: 'scope_creep_slayer', title: 'SLAYER OF SCOPE', desc: 'Defeat the Scope Creep Boss monster in District 0', badge_code: 'ACH_02', icon: '👾', unlocked: false },
  { id: 'combo_king', title: '5X COMBO STRIKE', desc: 'Answer 5 quiz questions consecutively without missing', badge_code: 'ACH_03', icon: '⚡', unlocked: false },
  { id: 'perfect_arcade_run', title: 'FLAWLESS CLEAR', desc: 'Clear a level quiz without losing a single shield', badge_code: 'ACH_04', icon: '🛡️', unlocked: false },
  { id: 'speed_runner', title: 'CYBER SPEEDRUNNER', desc: 'Clear an arcade battle in under 45 seconds', badge_code: 'ACH_05', icon: '⏱️', unlocked: false },
  { id: 'district_conqueror', title: 'DISTRICT OVERLORD', desc: 'Clear all levels and the final boss in any district', badge_code: 'ACH_06', icon: '👑', unlocked: false },
  { id: 'flashcard_matrix', title: 'NEURAL UPLOAD', desc: 'Review 25 holographic flashcards in the Matrix', badge_code: 'ACH_07', icon: '💾', unlocked: false },
  { id: 'streak_3', title: 'NEON RUNNER', desc: 'Maintain a 3-day arcade study streak', badge_code: 'ACH_08', icon: '🔥', unlocked: false },
  { id: 'streak_7', title: 'CYBER LEGEND', desc: 'Maintain a 7-day arcade study streak', badge_code: 'ACH_09', icon: '🌟', unlocked: false },
  { id: 'deck_hacker', title: 'DECK HOARDER', desc: 'Upload 3 lecture slide presentations into Product City', badge_code: 'ACH_10', icon: '📼', unlocked: false },
  { id: 'unicorn_founder', title: 'UNICORN WARLORD', desc: 'Reach player rank Level 10 in Product City', badge_code: 'ACH_11', icon: '🦄', unlocked: false },
  { id: 'midnight_coder', title: 'MIDNIGHT CODER', desc: 'Win an arcade battle between 11 PM and 4 AM', badge_code: 'ACH_12', icon: '🌙', unlocked: false }
];

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const DEMO_DISTRICT_ID = 'district-0-foundry';

function generateDemoDistrict(): {
  district: District;
  levels: Level[];
  flashcards: Flashcard[];
  questions: Question[];
  boss: BossMonster;
} {
  const boss: BossMonster = {
    id: 'boss-scope-creep',
    district_id: DEMO_DISTRICT_ID,
    name: 'THE SCOPE CREEP',
    title: 'Eater of Roadmaps & Destroyer of Sprints',
    avatar_type: 'scope_creep',
    max_hp: 100,
    current_hp: 100,
    weakness: 'Ruthless RICE prioritization & Sean Ellis PMF testing',
    defeat_xp: 250,
    completed: false,
    color: '#FF2E93'
  };

  const district: District = {
    id: DEMO_DISTRICT_ID,
    title: 'DISTRICT 0: THE CYBER FOUNDRY',
    tagline: 'Learning Science & Retention Protocols for Founders',
    arcade_cabinet_color: '#00E5FF',
    neon_glow: 'rgba(0, 229, 255, 0.5)',
    source_filename: 'Product_Foundry_Protocols.pptx',
    total_slides: 16,
    raw_text: 'Cyberpunk founder briefing on Active Recall Retrieval, Spaced Memory Algorithms, Cognitive Load Architecture, and The Feynman Model.',
    status: 'ready',
    created_at: new Date().toISOString(),
    is_demo: true,
    boss
  };

  const levels: Level[] = [
    {
      id: 'demo-lvl-1',
      district_id: DEMO_DISTRICT_ID,
      order_num: 1,
      code_name: 'GRID-01: RETRIEVAL SYNTHESIS',
      title: 'Active Recall vs. Passive Reading',
      explanation: 'Passive rereading produces a dangerous false hallucination of competence. Active recall forces the neural wetware to reconstruct knowledge without external references, triggering synaptic plasticity.',
      analogy: 'Rereading notes is like watching someone else play an arcade fighter. Active recall is putting your quarters in and executing the 10-hit combo yourself.',
      product_example: 'Duolingo refuses to show static vocab tables. It immediately forces users into a live translation fight, strengthening memory retrieval pathways.',
      slide_refs: 'Slides 2-5',
      unlocked: true,
      completed: false,
      stars: 0
    },
    {
      id: 'demo-lvl-2',
      district_id: DEMO_DISTRICT_ID,
      order_num: 2,
      code_name: 'GRID-02: MEMORY DECAY PROTOCOL',
      title: 'Spaced Repetition & The Forgetting Curve',
      explanation: 'Ebbinghaus demonstrated memory decays exponentially without active reinforcement (~70% lost in 48 hours). Reviewing at calculated intervals resets the decay curve and consolidates memory into permanent storage.',
      analogy: 'Cramming is like overclocking a graphics card until it melts. Spaced repetition is balanced liquid cooling that runs peak performance 24/7.',
      product_example: 'Anki and SuperMemo use mathematical decay algorithms (SM-2) to ping you with a card at the exact millisecond before total memory erasure.',
      slide_refs: 'Slides 6-9',
      unlocked: false,
      completed: false,
      stars: 0
    },
    {
      id: 'demo-lvl-3',
      district_id: DEMO_DISTRICT_ID,
      order_num: 3,
      code_name: 'GRID-03: DE-JARGON CIPHER',
      title: 'The Feynman Model & Mental Schemas',
      explanation: 'Richard Feynman proved true mastery requires explaining concepts in jargon-free language that a 10-year-old grasps. Buzzwords are smoke bombs used by imposters to hide architectural knowledge voids.',
      analogy: 'If you can’t build a drone with raw components, reciting the parts catalog doesn’t make you an aerospace engineer.',
      product_example: 'Steve Jobs stripped away technical specs: not a "5GB spinning mechanical drive", but "1,000 songs in your pocket".',
      slide_refs: 'Slides 10-12',
      unlocked: false,
      completed: false,
      stars: 0
    },
    {
      id: 'demo-lvl-4',
      district_id: DEMO_DISTRICT_ID,
      order_num: 4,
      code_name: 'GRID-04: BANDWIDTH BOTTLENECK',
      title: 'Cognitive Load & Dual Coding',
      explanation: 'Human working memory is bottlenecked at 4 to 7 discrete chunks. Splitting information into simultaneous visual and verbal channels doubles transmission capacity without frying the user’s cognitive circuit.',
      analogy: 'Your working memory is a 512MB RAM stick. If you load 4K video textures with zero compression, the system crashes. Clean visual schemas are your GPU.',
      product_example: 'Figma and Miro dominate because spatial diagrams let engineering teams comprehend sprawling microservice architecture without mental paralysis.',
      slide_refs: 'Slides 13-16',
      unlocked: false,
      completed: false,
      stars: 0
    }
  ];

  const flashcards: Flashcard[] = [
    { id: 'fc-1', level_id: 'demo-lvl-1', district_id: DEMO_DISTRICT_ID, front: 'What is Active Recall?', back: 'The learning practice of stimulating memory retrieval from long-term memory without looking at reference material.', slide_ref: 'Slide 3', ease_factor: 2.5, interval: 1, repetitions: 0, next_review: new Date().toISOString() },
    { id: 'fc-2', level_id: 'demo-lvl-1', district_id: DEMO_DISTRICT_ID, front: 'What is the "Illusion of Competence"?', back: 'Mistaking visual familiarity with highlighted text for actual ability to retrieve and apply knowledge under pressure.', slide_ref: 'Slide 4', ease_factor: 2.5, interval: 1, repetitions: 0, next_review: new Date().toISOString() },
    { id: 'fc-3', level_id: 'demo-lvl-2', district_id: DEMO_DISTRICT_ID, front: 'What does the Ebbinghaus Curve predict?', back: 'Exponential decay of retention over time: ~70% of new information is forgotten within 48 hours without review.', slide_ref: 'Slide 6', ease_factor: 2.5, interval: 1, repetitions: 0, next_review: new Date().toISOString() },
    { id: 'fc-4', level_id: 'demo-lvl-2', district_id: DEMO_DISTRICT_ID, front: 'What is the SM-2 Algorithm?', back: 'A mathematical formula that expands review intervals (1d, 3d, 7d, 16d) based on user response confidence.', slide_ref: 'Slide 8', ease_factor: 2.5, interval: 1, repetitions: 0, next_review: new Date().toISOString() },
    { id: 'fc-5', level_id: 'demo-lvl-3', district_id: DEMO_DISTRICT_ID, front: 'What is the Feynman Technique litmus test?', back: 'Explaining a complex concept using everyday analogies without using a single piece of industry jargon.', slide_ref: 'Slide 11', ease_factor: 2.5, interval: 1, repetitions: 0, next_review: new Date().toISOString() },
    { id: 'fc-6', level_id: 'demo-lvl-4', district_id: DEMO_DISTRICT_ID, front: 'What is Cognitive Load Theory?', back: 'Instructional design framework managing limited working memory bandwidth (4-7 chunks) to maximize retention.', slide_ref: 'Slide 14', ease_factor: 2.5, interval: 1, repetitions: 0, next_review: new Date().toISOString() },
    { id: 'fc-7', level_id: 'demo-lvl-4', district_id: DEMO_DISTRICT_ID, front: 'What is Paivio\'s Dual Coding?', back: 'Processing information through separate verbal and visual channels simultaneously, doubling recall avenues.', slide_ref: 'Slide 15', ease_factor: 2.5, interval: 1, repetitions: 0, next_review: new Date().toISOString() }
  ];

  const questions: Question[] = [
    // Level 1: 5 Questions
    {
      id: 'q-1-1',
      level_id: 'demo-lvl-1',
      district_id: DEMO_DISTRICT_ID,
      format: 'mcq',
      question: 'Which action triggers maximum synaptic reinforcement during a study sprint?',
      options: [
        'Highlighting sentences in fluorescent pink marker',
        'Answering practice exam prompts with notes closed',
        'Listening to an audiobook while driving',
        'Rereading the summary slide 3 times'
      ],
      correct_answer: 'Answering practice exam prompts with notes closed',
      explanation: 'Retrieval practice under desirable difficulty strengthens memory traces far more than passive rereading.',
      slide_ref: 'Slide 3',
      damage: 25
    },
    {
      id: 'q-1-2',
      level_id: 'demo-lvl-1',
      district_id: DEMO_DISTRICT_ID,
      format: 'true_false',
      question: 'True or False: The feeling of fluency when rereading your own notes is a proven guarantee of exam mastery.',
      options: ['True', 'False'],
      correct_answer: 'False',
      explanation: 'Fluency heuristic tricks students into mistaking recognition for actual recall capability.',
      slide_ref: 'Slide 4',
      damage: 25
    },
    {
      id: 'q-1-3',
      level_id: 'demo-lvl-1',
      district_id: DEMO_DISTRICT_ID,
      format: 'fill_blank',
      question: 'The cognitive blindspot where students mistake visual familiarity for true mastery is the illusion of ______.',
      correct_answer: 'competence',
      explanation: 'The illusion of competence happens when looking at notes makes material feel easy, but you cannot reproduce it without looking.',
      slide_ref: 'Slide 4',
      damage: 25
    },
    {
      id: 'q-1-4',
      level_id: 'demo-lvl-1',
      district_id: DEMO_DISTRICT_ID,
      format: 'scenario',
      question: 'MISSION: Your startup team must internalize a complex API integration before demo day tomorrow. What is the highest ROI study tactic?',
      options: [
        'Have engineers conduct closed-book whiteboarding sprints where they recreate the API flow from memory',
        'Distribute a 50-page PDF and ask everyone to read it before midnight',
        'Record a 4-hour meeting and tell them to watch it at 2x speed',
        'Memorize code snippets without understanding data contracts'
      ],
      correct_answer: 'Have engineers conduct closed-book whiteboarding sprints where they recreate the API flow from memory',
      explanation: 'Active retrieval on a whiteboard exposes false assumptions and cements architectural comprehension.',
      slide_ref: 'Slide 5',
      damage: 25
    },
    {
      id: 'q-1-5',
      level_id: 'demo-lvl-1',
      district_id: DEMO_DISTRICT_ID,
      format: 'mcq',
      question: 'What is the neurological mechanism activated when you struggle to retrieve an answer?',
      options: ['Synaptic consolidation & retrieval pathway strengthening', 'Prefrontal dopamine shutdown', 'Auditory cortex desensitization', 'Cerebellum clock reset'],
      correct_answer: 'Synaptic consolidation & retrieval pathway strengthening',
      explanation: 'Desirable difficulty stimulates neural pathways to physically re-wire for faster future access.',
      slide_ref: 'Slide 5',
      damage: 25
    },

    // Level 2 Questions
    {
      id: 'q-2-1',
      level_id: 'demo-lvl-2',
      district_id: DEMO_DISTRICT_ID,
      format: 'mcq',
      question: 'Approximately what percentage of new lecture material is lost within 48 hours without spaced review?',
      options: ['15%', '40%', '70%', '95%'],
      correct_answer: '70%',
      explanation: 'The Ebbinghaus Forgetting Curve shows dramatic drop-off (~70%) in the initial 48 hours without reinforcement.',
      slide_ref: 'Slide 6',
      damage: 25
    },
    {
      id: 'q-2-2',
      level_id: 'demo-lvl-2',
      district_id: DEMO_DISTRICT_ID,
      format: 'true_false',
      question: 'True or False: Cramming for 8 hours before an exam yields higher 6-month retention than 1 hour daily for 8 days.',
      options: ['True', 'False'],
      correct_answer: 'False',
      explanation: 'Cramming only impacts volatile working memory. Long-term consolidation requires sleep and spaced intervals.',
      slide_ref: 'Slide 9',
      damage: 25
    },
    {
      id: 'q-2-3',
      level_id: 'demo-lvl-2',
      district_id: DEMO_DISTRICT_ID,
      format: 'fill_blank',
      question: 'The algorithm widely used in computer-aided spaced repetition flashcard engines is ______-2.',
      correct_answer: 'SM',
      explanation: 'SuperMemo-2 (SM-2) calculates intervals and ease factors.',
      slide_ref: 'Slide 8',
      damage: 25
    },
    {
      id: 'q-2-4',
      level_id: 'demo-lvl-2',
      district_id: DEMO_DISTRICT_ID,
      format: 'scenario',
      question: 'TACTICAL CASE: You are rolling out a new product onboarding flow for users. To prevent churn drop-off, how do you schedule tooltips?',
      options: [
        'Dump all 24 feature tooltips in the user’s face in the first 60 seconds',
        'Trigger contextual, micro-onboarding prompts spaced across Day 1, Day 3, and Day 7 based on user actions',
        'Provide no onboarding and email a 30-page user manual after signup',
        'Lock the app until they watch a 45-minute video tutorial'
      ],
      correct_answer: 'Trigger contextual, micro-onboarding prompts spaced across Day 1, Day 3, and Day 7 based on user actions',
      explanation: 'Spaced, action-triggered learning respects working memory limits and embeds habit loops.',
      slide_ref: 'Slide 7',
      damage: 25
    },
    {
      id: 'q-2-5',
      level_id: 'demo-lvl-2',
      district_id: DEMO_DISTRICT_ID,
      format: 'mcq',
      question: 'What is the optimal moment to review an item in a spaced repetition cycle?',
      options: ['Right before you are about to forget it', 'Immediately after seeing the answer', 'Every 20 minutes continuously', 'Only after failing a test'],
      correct_answer: 'Right before you are about to forget it',
      explanation: 'Retrieving an item right at the edge of decay causes the strongest consolidation impulse.',
      slide_ref: 'Slide 7',
      damage: 25
    },

    // Level 3 Questions
    {
      id: 'q-3-1',
      level_id: 'demo-lvl-3',
      district_id: DEMO_DISTRICT_ID,
      format: 'mcq',
      question: 'What is the core test of the Feynman Model?',
      options: [
        'Explaining the concept to a 10-year-old using simple words and concrete analogies',
        'Using at least 5 technical acronyms per sentence',
        'Writing a 100-page corporate specification doc',
        'Creating a 3D animated video with no audio'
      ],
      correct_answer: 'Explaining the concept to a 10-year-old using simple words and concrete analogies',
      explanation: 'If you cannot communicate it simply without jargon crutches, your own comprehension has gaps.',
      slide_ref: 'Slide 11',
      damage: 25
    },
    {
      id: 'q-3-2',
      level_id: 'demo-lvl-3',
      district_id: DEMO_DISTRICT_ID,
      format: 'fill_blank',
      question: 'A compressed framework or representation of how something works in the real world is known as a mental ______.',
      correct_answer: 'model',
      explanation: 'Mental models allow product managers to reason from first principles.',
      slide_ref: 'Slide 12',
      damage: 25
    },
    {
      id: 'q-3-3',
      level_id: 'demo-lvl-3',
      district_id: DEMO_DISTRICT_ID,
      format: 'scenario',
      question: 'EXECUTIVE BRIEFING: You need to convince the CFO to fund an AI caching layer. Which explanation wins the budget?',
      options: [
        '"It operates as an LRU Redis key-value cluster with distributed hash rings over Kubernetes pods."',
        '"Think of it like a barista keeping the 5 most popular drinks ready on the counter, so lines move 80% faster and customers spend $400K more."',
        '"Trust the engineering team because Redis is popular on GitHub."',
        '"Here are 20 pages of server latency logs for your weekend reading."'
      ],
      correct_answer: '"Think of it like a barista keeping the 5 most popular drinks ready on the counter, so lines move 80% faster and customers spend $400K more."',
      explanation: 'The barista analogy connects technical architecture to business speed and revenue outcomes.',
      slide_ref: 'Slide 12',
      damage: 25
    },
    {
      id: 'q-3-4',
      level_id: 'demo-lvl-3',
      district_id: DEMO_DISTRICT_ID,
      format: 'true_false',
      question: 'True or False: Using high-density jargon in product presentations proves superior competence to executive leadership.',
      options: ['True', 'False'],
      correct_answer: 'False',
      explanation: 'Jargon obscures real mechanics and indicates a lack of conceptual translation ability.',
      slide_ref: 'Slide 10',
      damage: 25
    },
    {
      id: 'q-3-5',
      level_id: 'demo-lvl-3',
      district_id: DEMO_DISTRICT_ID,
      format: 'mcq',
      question: 'When practicing the Feynman Model and your explanation hits a dead-end, what is step 3?',
      options: ['Return to the source lecture slides to patch that exact concept gap', 'Invent an answer and hope nobody notices', 'Give up and switch careers', 'Delete the slide'],
      correct_answer: 'Return to the source lecture slides to patch that exact concept gap',
      explanation: 'The Feynman Model is a diagnostic loop designed to pinpoint and repair knowledge leaks.',
      slide_ref: 'Slide 11',
      damage: 25
    },

    // Level 4 Questions
    {
      id: 'q-4-1',
      level_id: 'demo-lvl-4',
      district_id: DEMO_DISTRICT_ID,
      format: 'mcq',
      question: 'What is the typical working memory capacity limit of human consciousness?',
      options: ['1-2 concepts', '4-7 chunks of information', '25 variables simultaneously', 'Unlimited with caffeine'],
      correct_answer: '4-7 chunks of information',
      explanation: 'George Miller and modern cognitive psychology confirm working memory bottleneck at 4-7 chunks.',
      slide_ref: 'Slide 14',
      damage: 25
    },
    {
      id: 'q-4-2',
      level_id: 'demo-lvl-4',
      district_id: DEMO_DISTRICT_ID,
      format: 'true_false',
      question: 'True or False: According to Dual Coding Theory, combining visual diagrams with verbal narrative improves retention compared to text alone.',
      options: ['True', 'False'],
      correct_answer: 'True',
      explanation: 'Dual coding leverages parallel cognitive processing channels, creating two independent retrieval pathways.',
      slide_ref: 'Slide 15',
      damage: 25
    },
    {
      id: 'q-4-3',
      level_id: 'demo-lvl-4',
      district_id: DEMO_DISTRICT_ID,
      format: 'fill_blank',
      question: 'In Cognitive Load Theory, unnecessary mental friction created by bad UI layout is called ______ cognitive load.',
      correct_answer: 'extraneous',
      explanation: 'Extraneous cognitive load wastes mental bandwidth on decoding chaotic presentation rather than learning.',
      slide_ref: 'Slide 14',
      damage: 25
    },
    {
      id: 'q-4-4',
      level_id: 'demo-lvl-4',
      district_id: DEMO_DISTRICT_ID,
      format: 'scenario',
      question: 'UI OPTIMIZATION: Your analytics show 55% of users abandon your signup form. How do you apply Cognitive Load Theory to fix it?',
      options: [
        'Display all 32 inputs on one massive scrolling page with bright red asterisks',
        'Break the flow into 3 progressive, chunked steps with visual milestone markers',
        'Add 4 animated promotional banners next to the credit card input',
        'Hide the submit button until the user scrolls past legal disclaimers'
      ],
      correct_answer: 'Break the flow into 3 progressive, chunked steps with visual milestone markers',
      explanation: 'Chunking information reduces extraneous load and matches human working memory thresholds.',
      slide_ref: 'Slide 15',
      damage: 25
    },
    {
      id: 'q-4-5',
      level_id: 'demo-lvl-4',
      district_id: DEMO_DISTRICT_ID,
      format: 'mcq',
      question: 'Which type of cognitive load is beneficial because it directly constructs mental schemas and deep mastery?',
      options: ['Extraneous load', 'Intrinsic load', 'Germane load', 'Zero load'],
      correct_answer: 'Germane load',
      explanation: 'Germane load is the productive mental effort dedicated to processing and integrating knowledge.',
      slide_ref: 'Slide 14',
      damage: 25
    },

    // Boss Battle Questions (Scope Creep Boss Fight)
    {
      id: 'q-boss-1',
      level_id: 'boss-scope-creep',
      district_id: DEMO_DISTRICT_ID,
      format: 'scenario',
      question: 'BOSS ENCOUNTER ROUND 1: The Scope Creep attacks with a 40-feature wishlist right before sprint freeze! What is your weapon of defense?',
      options: [
        'Ruthless RICE prioritization anchored in verified user retention metrics, rejecting non-core items',
        'Say yes to all 40 features and ask engineers to work 90-hour weeks',
        'Quietly delete the backlog and pretend the email was lost in spam',
        'Cancel the product release entirely'
      ],
      correct_answer: 'Ruthless RICE prioritization anchored in verified user retention metrics, rejecting non-core items',
      explanation: 'CRITICAL HIT! Rigorous prioritization anchored in retention metrics damages the Scope Creep monster.',
      slide_ref: 'Comprehensive',
      damage: 25,
      is_boss: true
    },
    {
      id: 'q-boss-2',
      level_id: 'boss-scope-creep',
      district_id: DEMO_DISTRICT_ID,
      format: 'mcq',
      question: 'BOSS ENCOUNTER ROUND 2: The Scope Creep tries to distract the team with a 50-slide text-heavy architecture deck. How do you counter?',
      options: [
        'Apply Dual Coding: transform the spec into clean visual interaction flows with chunked responsibilities',
        'Print out the 50 slides on poster board and paste them on the wall',
        'Ignore architecture entirely and start writing frontend CSS',
        'Schedule a 6-hour meeting to read the slides word-for-word'
      ],
      correct_answer: 'Apply Dual Coding: transform the spec into clean visual interaction flows with chunked responsibilities',
      explanation: 'CRITICAL HIT! Dual coding reduces extraneous cognitive load and aligns the engineering team.',
      slide_ref: 'Comprehensive',
      damage: 25,
      is_boss: true
    },
    {
      id: 'q-boss-3',
      level_id: 'boss-scope-creep',
      district_id: DEMO_DISTRICT_ID,
      format: 'true_false',
      question: 'BOSS ENCOUNTER ROUND 3: True or False: Agreeing to customer feature requests without validating underlying root pain points is sound product management.',
      options: ['True', 'False'],
      correct_answer: 'False',
      explanation: 'CRITICAL HIT! Building what users say they want without uncovering the underlying job-to-be-done breeds monstrous bloat.',
      slide_ref: 'Comprehensive',
      damage: 25,
      is_boss: true
    },
    {
      id: 'q-boss-4',
      level_id: 'boss-scope-creep',
      district_id: DEMO_DISTRICT_ID,
      format: 'scenario',
      question: 'BOSS FINAL STRIKE: The Scope Creep is at 25% HP! It demands to know: what is the single most definitive indicator of real Product-Market Fit?',
      options: [
        'Sean Ellis 40% benchmark: over 40% of surveyed users would be "very disappointed" if the product disappeared tomorrow',
        'Total number of Twitter retweets on the launch announcement',
        'The aesthetic quality of the landing page gradient',
        'How many venture capital firms sent connection requests on LinkedIn'
      ],
      correct_answer: 'Sean Ellis 40% benchmark: over 40% of surveyed users would be "very disappointed" if the product disappeared tomorrow',
      explanation: 'FINISHING BLOW! The Sean Ellis PMF benchmark measures true user reliance and retention.',
      slide_ref: 'Comprehensive',
      damage: 25,
      is_boss: true
    }
  ];

  return { district, levels, flashcards, questions, boss };
}

class Store {
  private data: ArcadeDatabase;

  constructor() {
    this.data = this.load();
  }

  private load(): ArcadeDatabase {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('Failed to parse arcade_db.json, re-initializing...', err);
      }
    }

    // Seed initial arcade database with District 0
    const demo = generateDemoDistrict();
    const initialData: ArcadeDatabase = {
      districts: [demo.district],
      levels: demo.levels,
      flashcards: demo.flashcards,
      questions: demo.questions,
      profile: {
        handle: 'CYBER_FOUNDER',
        credits_xp: 250,
        level: 1,
        rank_title: 'Rookie Founder',
        streak_days: 1,
        last_active_date: getTodayString(),
        shields: 5,
        max_shields: 5,
        highest_combo: 3,
        bosses_defeated: 0,
        completed_level_ids: [],
        completed_district_ids: [],
        badges: INITIAL_RETRO_ACHIEVEMENTS
      }
    };

    this.saveData(initialData);
    return initialData;
  }

  private saveData(data: ArcadeDatabase): void {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  public save(): void {
    this.saveData(this.data);
  }

  // --- Districts ---
  public getDistricts(): District[] {
    return this.data.districts.map((d) => {
      const levels = this.data.levels.filter((l) => l.district_id === d.id);
      return {
        ...d,
        levels
      };
    });
  }

  public getDistrictById(id: string): (District & { levels: Level[] }) | null {
    const district = this.data.districts.find((d) => d.id === id);
    if (!district) return null;
    const levels = this.data.levels
      .filter((l) => l.district_id === id)
      .sort((a, b) => a.order_num - b.order_num);
    return {
      ...district,
      levels
    };
  }

  public createDistrict(district: District, levels: Level[], flashcards: Flashcard[], questions: Question[], boss?: BossMonster): District {
    if (boss) district.boss = boss;
    this.data.districts.unshift(district);
    this.data.levels.push(...levels);
    this.data.flashcards.push(...flashcards);
    this.data.questions.push(...questions);
    this.save();
    return district;
  }

  public deleteDistrict(id: string): boolean {
    if (id === DEMO_DISTRICT_ID) return false;
    this.data.districts = this.data.districts.filter((d) => d.id !== id);
    this.data.levels = this.data.levels.filter((l) => l.district_id !== id);
    this.data.flashcards = this.data.flashcards.filter((f) => f.district_id !== id);
    this.data.questions = this.data.questions.filter((q) => q.district_id !== id);
    this.save();
    return true;
  }

  // --- Levels ---
  public getLevel(districtId: string, orderNumOrId: number | string): (Level & { flashcards: Flashcard[]; questions: Question[] }) | null {
    const level = this.data.levels.find(
      (l) => l.district_id === districtId && (l.order_num === Number(orderNumOrId) || l.id === String(orderNumOrId))
    );
    if (!level) return null;
    const flashcards = this.data.flashcards.filter((f) => f.level_id === level.id);
    const questions = this.data.questions.filter((q) => q.level_id === level.id);
    return {
      ...level,
      flashcards,
      questions
    };
  }

  public completeLevel(levelId: string, districtId: string, score: number): void {
    if (!this.data.profile.completed_level_ids.includes(levelId)) {
      this.data.profile.completed_level_ids.push(levelId);
      this.unlockBadge('first_insert_coin');
    }

    const currentLevel = this.data.levels.find((l) => l.id === levelId);
    if (currentLevel) {
      currentLevel.completed = true;
      currentLevel.high_score = Math.max(currentLevel.high_score || 0, score);
      currentLevel.stars = score >= 90 ? 3 : score >= 70 ? 2 : 1;

      // Unlock next level in district
      const nextLevel = this.data.levels.find(
        (l) => l.district_id === districtId && l.order_num === currentLevel.order_num + 1
      );
      if (nextLevel) {
        nextLevel.unlocked = true;
      }
    }

    this.save();
  }

  // --- Flashcards ---
  public getDueFlashcards(districtId?: string): Flashcard[] {
    const now = new Date().toISOString();
    return this.data.flashcards.filter((f) => {
      if (districtId && f.district_id !== districtId) return false;
      return !f.next_review || f.next_review <= now;
    });
  }

  public updateFlashcardReview(id: string, rating: 'again' | 'good' | 'easy'): Flashcard | null {
    const card = this.data.flashcards.find((f) => f.id === id);
    if (!card) return null;

    let { ease_factor, interval, repetitions } = card;
    if (rating === 'again') {
      repetitions = 0;
      interval = 1;
      ease_factor = Math.max(1.3, ease_factor - 0.2);
    } else if (rating === 'good') {
      if (repetitions === 0) interval = 1;
      else if (repetitions === 1) interval = 3;
      else interval = Math.round(interval * ease_factor);
      repetitions += 1;
    } else {
      if (repetitions === 0) interval = 2;
      else if (repetitions === 1) interval = 6;
      else interval = Math.round(interval * ease_factor * 1.3);
      repetitions += 1;
      ease_factor += 0.15;
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + interval);

    card.ease_factor = ease_factor;
    card.interval = interval;
    card.repetitions = repetitions;
    card.next_review = nextDate.toISOString();
    card.status = repetitions >= 3 ? 'mastered' : 'learning';

    this.addCreditsXP(15);
    this.save();
    return card;
  }

  // --- Questions ---
  public getQuestionsForLevel(levelId: string): Question[] {
    return this.data.questions.filter((q) => q.level_id === levelId);
  }

  public getBossQuestions(districtId: string): Question[] {
    const bossLevelId = 'boss-' + districtId.replace('district-', '');
    const specificBossQuestions = this.data.questions.filter((q) => q.level_id === bossLevelId || q.is_boss);
    if (specificBossQuestions.length > 0) return specificBossQuestions;

    const districtQuestions = this.data.questions.filter((q) => q.district_id === districtId);
    return districtQuestions.slice(0, 8);
  }

  // --- Profile & Gamification ---
  public getProfile(): PlayerArcadeProfile {
    this.checkStreak();
    return this.data.profile;
  }

  public addCreditsXP(amount: number): { credits_xp: number; level: number; leveledUp: boolean } {
    const prevLevel = this.data.profile.level;
    this.data.profile.credits_xp += amount;
    const newLevel = Math.floor(this.data.profile.credits_xp / 150) + 1;
    this.data.profile.level = newLevel;

    // Update rank title
    if (newLevel >= 10) this.data.profile.rank_title = 'Unicorn Warlord';
    else if (newLevel >= 6) this.data.profile.rank_title = 'Series A Slayer';
    else if (newLevel >= 3) this.data.profile.rank_title = 'Seed Hacker';
    else this.data.profile.rank_title = 'Rookie Founder';

    if (newLevel >= 10) this.unlockBadge('unicorn_founder');

    this.save();
    return {
      credits_xp: this.data.profile.credits_xp,
      level: newLevel,
      leveledUp: newLevel > prevLevel
    };
  }

  public deductShield(): number {
    this.data.profile.shields = Math.max(0, this.data.profile.shields - 1);
    this.save();
    return this.data.profile.shields;
  }

  public rechargeShields(): number {
    this.data.profile.shields = this.data.profile.max_shields;
    this.save();
    return this.data.profile.shields;
  }

  public unlockBadge(badgeId: string): RetroAchievement | null {
    const badge = this.data.profile.badges.find((b) => b.id === badgeId);
    if (badge && !badge.unlocked) {
      badge.unlocked = true;
      badge.unlocked_at = new Date().toISOString();
      this.save();
      return badge;
    }
    return null;
  }

  public defeatBoss(districtId: string): void {
    this.data.profile.bosses_defeated += 1;
    if (!this.data.profile.completed_district_ids.includes(districtId)) {
      this.data.profile.completed_district_ids.push(districtId);
      this.unlockBadge('district_conqueror');
    }
    if (districtId === DEMO_DISTRICT_ID) {
      this.unlockBadge('scope_creep_slayer');
    }
    this.save();
  }

  public checkStreak(): void {
    const today = getTodayString();
    const lastActive = this.data.profile.last_active_date;
    if (lastActive === today) return;

    const lastDate = new Date(lastActive);
    const currentDate = new Date(today);
    const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      this.data.profile.streak_days += 1;
      this.data.profile.last_active_date = today;
      if (this.data.profile.streak_days >= 3) this.unlockBadge('streak_3');
      if (this.data.profile.streak_days >= 7) this.unlockBadge('streak_7');
      this.save();
    } else if (diffDays > 1) {
      this.data.profile.streak_days = 1;
      this.data.profile.last_active_date = today;
      this.save();
    }
  }

  public resetProgress(): void {
    this.data.profile = {
      handle: 'CYBER_FOUNDER',
      credits_xp: 0,
      level: 1,
      rank_title: 'Rookie Founder',
      streak_days: 1,
      last_active_date: getTodayString(),
      shields: 5,
      max_shields: 5,
      highest_combo: 0,
      bosses_defeated: 0,
      completed_level_ids: [],
      completed_district_ids: [],
      badges: INITIAL_RETRO_ACHIEVEMENTS.map((b) => ({ ...b, unlocked: false, unlocked_at: undefined }))
    };

    this.data.levels.forEach((l) => {
      l.completed = false;
      l.high_score = 0;
      l.stars = 0;
      l.unlocked = l.order_num === 1;
    });

    this.save();
  }
}

export const db = new Store();
