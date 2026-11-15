import { GoogleGenerativeAI } from '@google/generative-ai';

interface GeminiDistrictOutput {
  district_title: string;
  tagline: string;
  cabinet_color: string;
  neon_glow: string;
  boss: {
    name: string;
    title: string;
    avatar_type: 'scope_creep' | 'churn_goliath' | 'tech_debt' | 'over_engineer';
    weakness: string;
    color: string;
  };
  levels: {
    title: string;
    code_name: string;
    slide_refs: string;
    explanation: string;
    analogy: string;
    product_example: string;
    flashcards: {
      front: string;
      back: string;
      slide_ref: string;
    }[];
    questions: {
      format: 'mcq' | 'true_false' | 'fill_blank' | 'scenario';
      question: string;
      options?: string[];
      correct_answer: string;
      explanation: string;
      slide_ref: string;
    }[];
  }[];
  boss_questions: {
    format: 'mcq' | 'true_false' | 'fill_blank' | 'scenario';
    question: string;
    options?: string[];
    correct_answer: string;
    explanation: string;
    slide_ref: string;
  }[];
}

const NEON_COLORS = [
  { cabinet: '#FF2E93', glow: 'rgba(255, 46, 147, 0.5)' }, // Electric Pink
  { cabinet: '#C6FF00', glow: 'rgba(198, 255, 0, 0.5)' },  // Acid Lime
  { cabinet: '#00E5FF', glow: 'rgba(0, 229, 255, 0.5)' },  // Cyan
  { cabinet: '#FF8A00', glow: 'rgba(255, 138, 0, 0.5)' },  // Sunset Orange
  { cabinet: '#FFD60A', glow: 'rgba(255, 214, 10, 0.5)' }  // Hot Yellow
];

function cleanJsonResponse(rawText: string): string {
  let clean = rawText.trim();
  // Strip Markdown JSON code fences if present
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  }
  return clean.trim();
}

function validateDistrictOutput(obj: any): obj is GeminiDistrictOutput {
  if (!obj || typeof obj !== 'object') return false;
  if (typeof obj.district_title !== 'string') return false;
  if (!Array.isArray(obj.levels) || obj.levels.length === 0) return false;
  return true;
}

export async function generateDistrictWithGemini(
  deckTitle: string,
  totalSlides: number,
  combinedText: string
): Promise<GeminiDistrictOutput> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your-gemini-api-key-here') {
    console.warn('⚠️ No GEMINI_API_KEY configured. Running arcade heuristic generator.');
    return generateFallbackDistrict(deckTitle, totalSlides, combinedText);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Using official fast production model gemini-1.5-flash
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.35,
      responseMimeType: 'application/json'
    }
  });

  const prompt = `You are the lead game designer and cyberpunk dungeon master for "PM ARCADE", an indie neo-arcade learning game.
Transform this university lecture presentation into an electrifying retro-arcade District within "Product City".

STUDY MATERIAL:
Presentation Title: "${deckTitle}"
Total Slides: ${totalSlides}

RAW SLIDE CONTENT:
${combinedText.slice(0, 35000)}

STRICT DESIGN RULES:
1. Grounding: All questions, explanations, analogies, and boss mechanics MUST be strictly grounded in the uploaded slides. Do not fabricate external facts.
2. The District:
   - "district_title": e.g. "DISTRICT: THE METRIC MATRIX", "SECTOR 7: SPRINT ANOMALY"
   - "tagline": A punchy arcade mission tagline
3. The District Boss Monster:
   - Identify the main operational/product threat or failure mode in the deck (e.g., "THE CHURN LEVIATHAN", "THE SCOPE CREEP", "THE TECH DEBT HYDRA", "THE OVER-ENGINEER").
   - "name": uppercase monster name
   - "title": e.g. "Devourer of Sprints and Burner of Runway"
   - "avatar_type": "scope_creep" | "churn_goliath" | "tech_debt" | "over_engineer"
   - "weakness": specific concept from the slides that counters it
4. 4 to 8 Arcade Levels:
   - "code_name": e.g. "GRID-01", "NODE-02"
   - "title": Core concept name
   - "explanation": Crisp, punchy explanation
   - "analogy": Retro or relatable game/cyberpunk analogy
   - "product_example": How top tech firms execute this (e.g. Netflix, Stripe, Linear)
   - "slide_refs": Exact slide numbers (e.g. "Slides 4-6")
   - "flashcards": 4 to 6 flashcards per level
   - "questions": 5 questions per level in mixed formats ('mcq', 'true_false', 'fill_blank', 'scenario').
5. Boss Battle: 6 to 8 questions combining all levels for the final boss encounter.

OUTPUT FORMAT: Return valid JSON matching the schema.`;

  // Attempt generation with 1 retry on failure
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`🤖 [GEMINI] Generating arcade district for "${deckTitle}" (attempt ${attempt}/2)...`);
      const result = await model.generateContent(prompt);
      const rawText = result.response.text();
      const cleaned = cleanJsonResponse(rawText);
      const parsed = JSON.parse(cleaned);

      if (!validateDistrictOutput(parsed)) {
        throw new Error('Malformed district structure from Gemini AI.');
      }

      console.log(`✅ [GEMINI] Successfully generated district: "${parsed.district_title}" with ${parsed.levels.length} levels!`);
      return parsed;
    } catch (err: any) {
      console.warn(`⚠️ [GEMINI] Generation attempt ${attempt} failed:`, err.message || err);
      if (attempt === 2) {
        console.error('❌ All Gemini attempts failed. Engaging arcade heuristic generator fallback.');
        return generateFallbackDistrict(deckTitle, totalSlides, combinedText);
      }
    }
  }

  return generateFallbackDistrict(deckTitle, totalSlides, combinedText);
}

export async function askPixelWithGemini(
  levelTitle: string,
  levelContext: string,
  slideText: string,
  question: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your-gemini-api-key-here') {
    return `[PIXEL COMMS] Founder! In your slides for "${levelTitle}": ${levelContext.slice(0, 160)}... Set GEMINI_API_KEY in backend/.env for full real-time neural responses!`;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are "Pixel", a witty cyberpunk robot/blob arcade sidekick in PM ARCADE.
The player is on Level: "${levelTitle}".

LEVEL BRIEFING:
${levelContext}

SLIDE KNOWLEDGE BASE:
${slideText.slice(0, 15000)}

PLAYER ASKS:
"${question}"

RULES:
- Respond in 2-3 punchy, engaging sentences in Pixel's enthusiastic arcade sidekick persona.
- Ground answer 100% in the provided slide text.
- Give a practical tactical tip or rule of thumb for product managers.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err: any) {
    return `*BZZT* Pixel lost transmitter link to neural net: ${err.message || 'Try again, Founder!'}`;
  }
}

function generateFallbackDistrict(deckTitle: string, totalSlides: number, combinedText: string): GeminiDistrictOutput {
  const color = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
  const slides = combinedText.split(/--- Slide \d+.*---/i).filter((s) => s.trim().length > 20);
  const chunkCount = Math.min(Math.max(4, Math.ceil(slides.length / 4)), 6);

  const levels = [];
  const chunkSize = Math.max(1, Math.floor(slides.length / chunkCount));

  for (let i = 0; i < chunkCount; i++) {
    const startSlide = i * chunkSize + 1;
    const endSlide = Math.min(slides.length || totalSlides, (i + 1) * chunkSize);
    const chunk = slides.slice(i * chunkSize, (i + 1) * chunkSize).join(' ');
    const firstWords = chunk.trim().split(/\s+/).slice(0, 5).join(' ') || `Cyber Protocol ${i + 1}`;

    levels.push({
      title: firstWords,
      code_name: `NODE-0${i + 1}`,
      slide_refs: `Slides ${startSlide}-${endSlide}`,
      explanation: chunk.slice(0, 240).replace(/\n+/g, ' ') || `Mastering core architecture from slides ${startSlide} to ${endSlide}.`,
      analogy: `Think of this like calibrating the thrusters before jumping into hyperdrive. Without it, you veer off course.`,
      product_example: `High-velocity startups leverage this framework during bi-weekly sprint planning to ship without technical debt.`,
      flashcards: [
        {
          front: `What is the core premise of Slides ${startSlide}-${endSlide}?`,
          back: chunk.slice(0, 140).trim() || 'Foundational framework outlined in the presentation.',
          slide_ref: `Slide ${startSlide}`
        },
        {
          front: `How does a PM validate this in the field?`,
          back: 'Through quantitative funnel telemetry and qualitative discovery interviews.',
          slide_ref: `Slide ${startSlide + 1}`
        }
      ],
      questions: [
        {
          format: 'mcq' as const,
          question: `What is the primary objective detailed in Slides ${startSlide}-${endSlide}?`,
          options: [
            chunk.slice(0, 60).trim() || 'Strategic product execution',
            'Unvalidated feature bloat without measurement',
            'Ignoring user pain points and guessing requirements',
            'Slowing velocity without improving quality'
          ],
          correct_answer: chunk.slice(0, 60).trim() || 'Strategic product execution',
          explanation: `Directly derived from the presentation slides on Slide ${startSlide}.`,
          slide_ref: `Slide ${startSlide}`
        },
        {
          format: 'true_false' as const,
          question: `True or False: The principles in Slides ${startSlide}-${endSlide} directly reduce customer churn.`,
          options: ['True', 'False'],
          correct_answer: 'True',
          explanation: 'As proven in the slide material, adhering to these mechanics safeguards user retention.',
          slide_ref: `Slide ${startSlide}`
        },
        {
          format: 'fill_blank' as const,
          question: `Slide ${startSlide} asserts that product success requires cross-functional ______ between design and engineering.`,
          correct_answer: 'alignment',
          explanation: 'Cross-functional alignment is the bedrock of rapid software delivery.',
          slide_ref: `Slide ${startSlide}`
        },
        {
          format: 'scenario' as const,
          question: `ARCADE BATTLE: As the founder encountering the obstacle on Slide ${startSlide}, what is your critical move?`,
          options: [
            'Analyze qualitative user telemetry to diagnose the root constraint',
            'Panic and rebuild the entire frontend stack',
            'Ship unvetted features to appease stakeholders',
            'Blame the database latency'
          ],
          correct_answer: 'Analyze qualitative user telemetry to diagnose the root constraint',
          explanation: 'Grounded product founders triangulate user signal before writing code.',
          slide_ref: `Slide ${startSlide}`
        },
        {
          format: 'mcq' as const,
          question: `Which metric best proves mastery of Slide ${endSlide}?`,
          options: ['Cohort Retention & LTV:CAC Ratio', 'Total lines of code', 'Number of Slack messages sent', 'Coffee cups consumed'],
          correct_answer: 'Cohort Retention & LTV:CAC Ratio',
          explanation: 'True business viability is measured in unit economics and cohort retention.',
          slide_ref: `Slide ${endSlide}`
        }
      ]
    });
  }

  return {
    district_title: `DISTRICT: ${deckTitle.toUpperCase().replace(/\.[^/.]+$/, '')}`,
    tagline: 'High-stakes founder simulation in the neon grid',
    cabinet_color: color.cabinet,
    neon_glow: color.glow,
    boss: {
      name: 'THE SCOPE CREEP',
      title: 'Backlog Devourer & Deadline Destroyer',
      avatar_type: 'scope_creep',
      weakness: 'RICE Prioritization & Lean Prototyping',
      color: color.cabinet
    },
    levels,
    boss_questions: [
      {
        format: 'scenario',
        question: `FINAL BOSS ROUND: How does a PM slay the Scope Creep when stakeholders demand 20 unplanned features?`,
        options: [
          'Anchor decisions in Sean Ellis PMF testing and customer retention data',
          'Accept all features and cancel employee vacations',
          'Pretend the feature request ticket was never created',
          'Deploy untested code directly to production'
        ],
        correct_answer: 'Anchor decisions in Sean Ellis PMF testing and customer retention data',
        explanation: 'CRITICAL HIT! Retention data is kryptonite to the Scope Creep.',
        slide_ref: 'Comprehensive'
      },
      {
        format: 'mcq',
        question: 'Which metric best exposes false product validation?',
        options: ['Vanity downloads with 90% Day-30 churn', 'Organic NPS of 70', 'Net revenue retention over 120%', 'High referral rates'],
        correct_answer: 'Vanity downloads with 90% Day-30 churn',
        explanation: 'Vanity downloads mask leaking bucket retention problems.',
        slide_ref: 'Comprehensive'
      }
    ]
  };
}
