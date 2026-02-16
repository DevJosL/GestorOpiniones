import { Router } from 'express';
import {
    getOpinions,
    getOpinionById,
    createOpinion,
    updateOpinion,
    changeOpinionStatus,
    deleteOpinion
} from './opinion.controller.js';

import {
    validateCreateOpinion,
    validateUpdateOpinionRequest,
    validateChangeOpinionStatus,
    validateGetOpinionById
} from '../../middlewares/opinion-validators.js';

const router = Router();

router.get('/', getOpinions);

router.get('/:id',
     validateGetOpinionById,
      getOpinionById);

router.post('/', 
    validateCreateOpinion, 
    createOpinion);

router.put('/:id', 
    validateUpdateOpinionRequest, 
    updateOpinion);

router.put('/:id/status', 
    validateChangeOpinionStatus, 
    changeOpinionStatus);

router.delete('/:id', 
    validateChangeOpinionStatus, 
    deleteOpinion);

export default router;
