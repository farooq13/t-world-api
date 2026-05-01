import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';

import { config } from './config/env';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './utils/AppError';

import authRoutes from './routes/authRoutes';
import itemRoutes from './routes/itemRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

// Security Middleware 
app.use(helmet());
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'] }));

// Fix for express-mongo-sanitize with Express 5 (req.query is a getter in Express 5)
app.use((req, _res, next) => {
  Object.defineProperty(req, 'query', {
    value: { ...req.query },
    writable: true,
    configurable: true,
    enumerable: true,
  });
  next();
});
app.use(mongoSanitize()); // prevent NoSQL injection

// Request Parsing 
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Logging 
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Rate Limiting 
app.use('/api/', apiLimiter);

// Health Check 
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/items', itemRoutes);
app.use('/me', userRoutes);

// 404 Handler
app.use((_req, _res, next) => {
  next(new AppError(`Route not found.`, 404));
});

// Centralized Error Handler
app.use(errorHandler);

export default app;