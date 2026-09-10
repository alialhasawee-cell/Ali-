import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import {
  generateLessonPlan,
  evaluateFluencyAndWriting,
  generateQuizQuestions,
} from '../services/gemini';
import { tenantStore } from '../db/store';

export const aiRouter = Router();

// AI Lesson Plan Generator
aiRouter.post('/lesson-plan', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tenantId = req.tenantId || 'org_oxford';
    const { level, topic, durationMinutes, focusArea, targetAge } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Lesson topic is required' });
    }

    const plan = await generateLessonPlan(tenantId, {
      level: level || 'B2',
      topic,
      durationMinutes: Number(durationMinutes) || 60,
      focusArea: focusArea || 'Spoken Fluency & Idiomatic Usage',
      targetAge: targetAge || 'Adults & Academic Aspirants',
    });

    tenantStore.addAuditLog({
      organizationId: tenantId,
      userId: req.user?.id || 'teacher',
      userEmail: req.user?.email || 'teacher',
      userRole: req.user?.role || 'TEACHER',
      action: 'AI_LESSON_PLAN_GENERATED',
      resource: 'AI Tools',
      details: `Generated ${level} lesson plan for topic: ${topic}`,
      ipAddress: req.ip || '127.0.0.1',
    });

    res.json({ success: true, plan });
  } catch (error: any) {
    console.error('AI Lesson Plan error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate lesson plan' });
  }
});

// AI Fluency & Writing Assessor
aiRouter.post('/fluency-evaluator', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tenantId = req.tenantId || 'org_oxford';
    const { studentText, examType, targetBand } = req.body;

    if (!studentText || studentText.trim().length < 15) {
      return res.status(400).json({ error: 'Please enter at least 15 characters of speech transcript or essay text to evaluate.' });
    }

    const evaluation = await evaluateFluencyAndWriting(tenantId, {
      studentText,
      examType: examType || 'IELTS Academic Writing Task 2',
      targetBand: targetBand || '7.5',
    });

    tenantStore.addAuditLog({
      organizationId: tenantId,
      userId: req.user?.id || 'student',
      userEmail: req.user?.email || 'student',
      userRole: req.user?.role || 'STUDENT',
      action: 'AI_FLUENCY_EVALUATION',
      resource: 'AI Tools',
      details: `Evaluated ${examType} text (${studentText.length} chars), Band: ${evaluation.estimatedBand}`,
      ipAddress: req.ip || '127.0.0.1',
    });

    res.json({ success: true, evaluation });
  } catch (error: any) {
    console.error('AI Fluency Evaluator error:', error);
    res.status(500).json({ error: error.message || 'Failed to evaluate fluency and writing' });
  }
});

// AI Quiz Generator
aiRouter.post('/quiz-generator', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tenantId = req.tenantId || 'org_oxford';
    const { topic, level, count } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required to generate quiz questions' });
    }

    const questions = await generateQuizQuestions(tenantId, {
      topic,
      level: level || 'B2',
      count: Number(count) || 3,
    });

    res.json({ success: true, questions });
  } catch (error: any) {
    console.error('AI Quiz Generator error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate quiz questions' });
  }
});
