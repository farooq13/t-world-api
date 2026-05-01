import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

//   Runs after express-validator chains; short-circuits on first validation failure.
 
export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({
        field: e.type === 'field' ? e.path : undefined,
        message: e.msg,
      })),
    });
    return;
  }
  next();
};