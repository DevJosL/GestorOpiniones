import { Router } from 'express';
import {
  getComments,
  getCommentById,
  createComment,
  updateComment,
  changeCommentStatus,
} from './comment.controller.js';

import {
  validateCreateComment,
  validateUpdateCommentRequest,
  validateChangeCommentStatus,
  validateGetCommentById
} from '../../middlewares/comment-validators.js';

import { validateJWT } from '../../middlewares/auth-middlewares.js';

const router = Router();

router.get('/', getComments);

router.get('/:id',
  validateGetCommentById,
  getCommentById
);

router.post('/',
  validateJWT,
  validateCreateComment,
  createComment
);

router.put('/:id',
  validateJWT,
  validateUpdateCommentRequest,
  updateComment
);

router.put('/:id/status',
  validateJWT,
  validateChangeCommentStatus,
  changeCommentStatus
);

export default router;