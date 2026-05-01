import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { config } from '../config/env';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log all errors
  logger.error(`${err.name}: ${err.message}`);

  // Known operational errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: config.nodeEnv === 'development' ? err.stack : undefined,
    });
    return;
  }

  // Mongoose duplicate key (e.g. unique email)
  if ((err as NodeJS.ErrnoException).code === '11000') {
    const field = Object.keys((err as NodeJS.ErrnoException & { keyValue?: Record<string, unknown> }).keyValue ?? {})[0] ?? 'field';
    res.status(409).json({
      success: false,
      message: `A record with that ${field} already exists.`,
    });
    return;
  }

  // Mongoose validation error
  if (err instanceof MongooseError.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    res.status(400).json({
      success: false,
      message: messages.join('. '),
    });
    return;
  }

  // Mongoose cast error (bad ObjectId)
  if (err instanceof MongooseError.CastError) {
    res.status(400).json({
      success: false,
      message: `Invalid value for field: ${err.path}`,
    });
    return;
  }

  // JWT errors handled in auth middleware; fallback here
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
    return;
  }

  // Unhandled/unexpected errors – don't leak details in production
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred',
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
  });
};