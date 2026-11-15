import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { parseFile } from '../services/parser.js';
import { generateDistrictWithGemini } from '../services/gemini.js';
import { db } from '../db/store.js';
import { District, Level, Flashcard, Question, BossMonster } from '../types.js';

export const uploadRouter = Router();

const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pptx' || ext === '.ppt' || ext === '.pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only .pptx and .pdf presentation decks are accepted in the arcade!'));
    }
  }
});

uploadRouter.post('/', upload.array('files', 5), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'Please upload at least one presentation file (.pptx or .pdf).' });
    }

    const createdDistricts: District[] = [];

    for (const file of files) {
      const districtId = 'district-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
      const parsed = await parseFile(file.path, file.originalname);

      console.log(`📄 [UPLOAD] File: "${file.originalname}" | Extracted text length: ${parsed.combinedText.length} chars | Total slides: ${parsed.totalSlides}`);

      const aiData = await generateDistrictWithGemini(
        parsed.title,
        parsed.totalSlides,
        parsed.combinedText
      );

      const boss: BossMonster = {
        id: 'boss-' + districtId,
        district_id: districtId,
        name: aiData.boss?.name || 'THE SCOPE CREEP',
        title: aiData.boss?.title || 'Backlog Devourer',
        avatar_type: aiData.boss?.avatar_type || 'scope_creep',
        max_hp: 100,
        current_hp: 100,
        weakness: aiData.boss?.weakness || 'RICE Prioritization',
        defeat_xp: 250,
        completed: false,
        color: aiData.boss?.color || '#FF2E93'
      };

      const newDistrict: District = {
        id: districtId,
        title: aiData.district_title || `DISTRICT: ${parsed.title.toUpperCase()}`,
        tagline: aiData.tagline || 'Neon product strategy arena',
        arcade_cabinet_color: aiData.cabinet_color || '#00E5FF',
        neon_glow: aiData.neon_glow || 'rgba(0, 229, 255, 0.5)',
        source_filename: file.originalname,
        total_slides: parsed.totalSlides,
        raw_text: parsed.combinedText,
        status: 'ready',
        created_at: new Date().toISOString(),
        is_demo: false,
        boss
      };

      const newLevels: Level[] = [];
      const newFlashcards: Flashcard[] = [];
      const newQuestions: Question[] = [];

      aiData.levels.forEach((lvl, idx) => {
        const levelId = `${districtId}-lvl-${idx + 1}`;
        newLevels.push({
          id: levelId,
          district_id: districtId,
          order_num: idx + 1,
          code_name: lvl.code_name || `NODE-0${idx + 1}`,
          title: lvl.title,
          explanation: lvl.explanation,
          analogy: lvl.analogy,
          product_example: lvl.product_example,
          slide_refs: lvl.slide_refs,
          unlocked: idx === 0,
          completed: false,
          stars: 0
        });

        lvl.flashcards?.forEach((fc, fcIdx) => {
          newFlashcards.push({
            id: `fc-${levelId}-${fcIdx + 1}`,
            level_id: levelId,
            district_id: districtId,
            front: fc.front,
            back: fc.back,
            slide_ref: fc.slide_ref,
            ease_factor: 2.5,
            interval: 1,
            repetitions: 0,
            next_review: new Date().toISOString(),
            status: 'new'
          });
        });

        lvl.questions?.forEach((q, qIdx) => {
          newQuestions.push({
            id: `q-${levelId}-${qIdx + 1}`,
            level_id: levelId,
            district_id: districtId,
            format: q.format,
            question: q.question,
            options: q.options,
            correct_answer: q.correct_answer,
            explanation: q.explanation,
            slide_ref: q.slide_ref,
            damage: 25
          });
        });
      });

      aiData.boss_questions?.forEach((bq, bIdx) => {
        newQuestions.push({
          id: `q-boss-${districtId}-${bIdx + 1}`,
          level_id: 'boss-' + districtId,
          district_id: districtId,
          format: bq.format,
          question: bq.question,
          options: bq.options,
          correct_answer: bq.correct_answer,
          explanation: bq.explanation,
          slide_ref: bq.slide_ref,
          damage: 25,
          is_boss: true
        });
      });

      db.createDistrict(newDistrict, newLevels, newFlashcards, newQuestions, boss);
      db.addCreditsXP(100);
      createdDistricts.push(newDistrict);
    }

    const nonDemoDistricts = db.getDistricts().filter((d) => !d.is_demo);
    if (nonDemoDistricts.length >= 3) {
      db.unlockBadge('deck_hacker');
    }

    return res.status(201).json({
      success: true,
      districts: createdDistricts
    });
  } catch (err: any) {
    console.error('Arcade deck upload error:', err);
    return res.status(500).json({ error: err.message || 'Failed to upload arcade deck.' });
  }
});
