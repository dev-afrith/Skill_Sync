import { Router } from 'express';
import * as studentController from '../controllers/studentController';
import * as chatController from '../controllers/chatController';
import * as jobMarketController from '../controllers/jobMarketController';

const router = Router();

router.get('/students', studentController.getStudents);
router.post('/chat', chatController.chat);

// Job Market & AI Recommendations
router.get('/job-market-trends', jobMarketController.getJobMarketTrends);
router.post('/skill-gap-analysis', jobMarketController.getSkillGapAnalysis);

export default router;
