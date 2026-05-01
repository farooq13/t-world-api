import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController';
import { validate } from '../middleware/validate';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.')
    .matches(/\d/)
    .withMessage('Password must contain at least one number.'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email address.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

/*
  POST /auth/register
  Register a new user
  Public access
 */
router.post('/register', authLimiter, registerValidation, validate, authController.register);

/*
  POST /auth/login
  Authenticate user and return JWT
  Public
 */
router.post('/login', authLimiter, loginValidation, validate, authController.login);

export default router;