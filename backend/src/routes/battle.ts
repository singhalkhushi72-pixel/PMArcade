import { Router } from 'express';
import { db } from '../db/store.js';

export const battleRouter = Router();

/**
 * Submit level challenge answers
 */
battleRouter.post('/level/submit', (req, res) => {
  try {
    const { levelId, districtId, answers, timeSpentSeconds, shieldsLostInBattle, maxCombo } = req.body;
    const questions = db.getQuestionsForLevel(levelId);
    if (!questions || questions.length === 0) {
      return res.status(404).json({ error: 'No questions found for this node.' });
    }

    let correctCount = 0;
    const feedback: any[] = [];

    questions.forEach((q) => {
      const userAns = (answers?.[q.id] || '').trim().toLowerCase();
      const correctAns = q.correct_answer.trim().toLowerCase();
      const isCorrect = userAns === correctAns;

      if (isCorrect) correctCount += 1;

      feedback.push({
        questionId: q.id,
        question: q.question,
        userAnswer: answers?.[q.id] || '(No Input)',
        correctAnswer: q.correct_answer,
        isCorrect,
        explanation: q.explanation,
        slideRef: q.slide_ref
      });
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 60;

    // Credits XP: base 30 per correct answer + combo multiplier bonus
    let xpEarned = correctCount * 30;
    if (maxCombo >= 3) xpEarned += 25;
    if (maxCombo >= 5) {
      xpEarned += 50;
      db.unlockBadge('combo_king');
    }
    if (passed) xpEarned += 60;
    if (score === 100) xpEarned += 50;

    const xpResult = db.addCreditsXP(xpEarned);

    if (passed) {
      db.completeLevel(levelId, districtId, score);
    }

    if (shieldsLostInBattle === 0 && passed) {
      db.unlockBadge('perfect_arcade_run');
    }
    if (timeSpentSeconds && timeSpentSeconds < 45 && passed) {
      db.unlockBadge('speed_runner');
    }

    const hour = new Date().getHours();
    if ((hour >= 23 || hour < 4) && passed) {
      db.unlockBadge('midnight_coder');
    }

    return res.json({
      score,
      passed,
      correctCount,
      totalQuestions: questions.length,
      xpEarned,
      leveledUp: xpResult.leveledUp,
      newPlayerLevel: xpResult.level,
      feedback,
      profile: db.getProfile()
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * Get boss battle encounter for district
 */
battleRouter.get('/boss/:districtId', (req, res) => {
  try {
    const district = db.getDistrictById(req.params.districtId);
    if (!district) return res.status(404).json({ error: 'District not found.' });

    const questions = db.getBossQuestions(req.params.districtId);
    return res.json({
      boss: district.boss,
      questions
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * Submit boss battle results
 */
battleRouter.post('/boss/submit', (req, res) => {
  try {
    const { districtId, answers } = req.body;
    const questions = db.getBossQuestions(districtId);

    let correctCount = 0;
    const feedback: any[] = [];

    questions.forEach((q) => {
      const userAns = (answers?.[q.id] || '').trim().toLowerCase();
      const correctAns = q.correct_answer.trim().toLowerCase();
      const isCorrect = userAns === correctAns;
      if (isCorrect) correctCount += 1;

      feedback.push({
        questionId: q.id,
        question: q.question,
        userAnswer: answers?.[q.id] || '',
        correctAnswer: q.correct_answer,
        isCorrect,
        explanation: q.explanation,
        slideRef: q.slide_ref
      });
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 70;
    const xpEarned = correctCount * 40 + (passed ? 250 : 0);

    const xpResult = db.addCreditsXP(xpEarned);

    if (passed) {
      db.defeatBoss(districtId);
    }

    return res.json({
      score,
      passed,
      correctCount,
      totalQuestions: questions.length,
      xpEarned,
      leveledUp: xpResult.leveledUp,
      newPlayerLevel: xpResult.level,
      feedback,
      profile: db.getProfile()
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
