import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';  // Suponiendo que tienes este middleware de validación común

// Validación para crear un comentario
export const validateCreateComment = [
    body('commentText')
        .trim()
        .notEmpty()
        .withMessage('El texto del comentario es requerido')
        .isLength({ min: 1, max: 200 })
        .withMessage('El texto del comentario debe tener entre 1 y 200 caracteres'),

    body('opinionId')
        .notEmpty()
        .withMessage('El ID de la opinión es requerido')
        .isMongoId()
        .withMessage('El ID de la opinión debe ser un ObjectId válido'),

    checkValidators,
];

// Validación para actualizar un comentario
export const validateUpdateCommentRequest = [
    param('id')
        .isMongoId()
        .withMessage('ID debe ser un ObjectId válido'),

    body('commentText')
        .optional()  // El texto es opcional en la actualización
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('El texto del comentario debe tener entre 1 y 200 caracteres'),

    checkValidators,
];

// Validación para cambiar el estado de un comentario (activo/inactivo)
export const validateChangeCommentStatus = [
    param('id')
        .isMongoId()
        .withMessage('ID debe ser un ObjectId válido'),

    checkValidators,
];

// Validación para obtener un comentario por ID
export const validateGetCommentById = [
    param('id')
        .isMongoId()
        .withMessage('ID debe ser un ObjectId válido'),

    checkValidators,
];
