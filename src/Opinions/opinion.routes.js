import { Router } from 'express';
import {
  getOpinions,
  getOpinionById,
  createOpinion,
  updateOpinion,
  changeOpinionStatus
} from './opinion.controller.js';

import { validateJWT } from '../../middlewares/auth-middlewares.js';

const router = Router();

router.get('/', getOpinions);
router.get('/:id', getOpinionById);

router.post('/', validateJWT, createOpinion);
router.put('/:id', validateJWT, updateOpinion);
router.patch('/:id/status', validateJWT, changeOpinionStatus);

export default router;