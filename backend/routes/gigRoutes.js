import express from 'express';
import { getGigs, postGig } from '../controllers/gigController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getGigs);
router.post('/', requireAuth, postGig);

export default router;