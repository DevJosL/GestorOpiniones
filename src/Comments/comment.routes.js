import { Router } from 'express';
import {
    getComments,
    getCommentById,
    createComment,
    updateComment,
    changeCommentStatus,
    deleteComment
} from './comment.controller.js';

import {
    validateCreateComment,
    validateUpdateCommentRequest,
    validateChangeCommentStatus,
    validateGetCommentById
} from '../../middlewares/comment-validators.js';

const router = Router();

router.get('/', getComments);

router.get('/:id', 
    validateGetCommentById, 
    getCommentById);

router.post('/', 
    validateCreateComment, 
    createComment);

router.put('/:id', 
    validateUpdateCommentRequest, 
    updateComment);

router.put('/:id/status',  
    validateChangeCommentStatus, 
    changeCommentStatus);

router.delete('/:id',
     validateChangeCommentStatus, 
     deleteComment);

export default router;
