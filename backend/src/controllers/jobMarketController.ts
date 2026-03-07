import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateSkillGapAnalysis } from '../services/aiRecommendationService';

const prisma = new PrismaClient();

export const getJobMarketTrends = async (req: Request, res: Response) => {
    try {
        const trends = await prisma.jobMarketTrend.findMany({
            orderBy: { jobCount: 'desc' }
        });
        res.json(trends);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch job market trends' });
    }
};

export const getSkillGapAnalysis = async (req: Request, res: Response) => {
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills)) {
        return res.status(400).json({ error: 'Skills array is required' });
    }

    try {
        const analysis = await generateSkillGapAnalysis(skills);
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate skill gap analysis' });
    }
};
