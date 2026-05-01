import rateLimit from 'express-rate-limit';
import { config } from '../config/env';

/** General API rate limiter – 100 req / 15 min per IP */
export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});

/** Stricter limiter for auth routes – 10 req / 15 min per IP */
export const authLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login/register attempts. Please try again later.',
  },
});