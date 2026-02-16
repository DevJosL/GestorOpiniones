import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const validateCreateOpinion = [
    body('OpinionTitle')
        .trim()
        .notEmpty()
        .withMessage('El título de la opinión es requerido')
        .isLength({ min: 2, max: 200 })
        .withMessage('El título debe tener entre 2 y 200 caracteres'),

    body('OpinionCategory')
        .trim()
        .notEmpty()
        .withMessage('La categoría de la opinión es requerida')
        .isLength({ min: 2, max: 100 })
        .withMessage('La categoría debe tener entre 2 y 100 caracteres'),

    body('OpinionText')
        .trim()
        .notEmpty()
        .withMessage('El texto de la opinión es requerido')
        .isLength({ min: 2, max: 200 })
        .withMessage('El texto de la opinión debe tener entre 2 y 200 caracteres'),

    checkValidators,
];

export const validateUpdateOpinionRequest = [
    param('id')
        .isMongoId()
        .withMessage('ID debe ser un ObjectId'),

    body('OpinionTitle')
        .optional()
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage('El título debe tener entre 2 y 200 caracteres'),

    body('OpinionCategory')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('La categoría debe tener entre 2 y 100 caracteres'),

    body('OpinionText')
        .optional()
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage('El texto de la opinión debe tener entre 2 y 200 caracteres'),

    checkValidators,
];

export const validateChangeOpinionStatus = [
    param('id')
        .isMongoId()
        .withMessage('ID debe ser un ObjectId'),

    checkValidators,
];

export const validateGetOpinionById = [
    param('id')
        .isMongoId()
        .withMessage('ID debe ser un ObjectId'),

    checkValidators,
];
