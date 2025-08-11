import express from 'express';
import { getHealth, getApiInfo } from '../controllers/healthController.js';

const router = express.Router();

// Routes
router.get('/', getApiInfo);
router.get('/health', getHealth);

export default router;
