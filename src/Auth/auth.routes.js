import { Router } from 'express';
import { login, register } from './auth.controller.js';

const router = Router();

// Ruta para registro de usuarios
router.post('/register', register);

// Ruta para login de usuarios
router.post('/login', login);

export default router;