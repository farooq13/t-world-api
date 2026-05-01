import bcrypt from 'bcryptjs';
import type { StringValue } from 'ms';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { config } from '../config/env';
import { JwtPayload } from '../middleware/auth';

const SALT_ROUNDS = 12;

export const registerUser = async (email: string, password: string) => {
  // Check for existing user
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  const token = signToken({ userId: String(user._id), email: user.email });

  return { userId: String(user._id), token };
};

export const loginUser = async (email: string, password: string) => {
  // Re-include password (select: false by default)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = signToken({ userId: String(user._id), email: user.email });

  return {
    token,
    user: { id: String(user._id), email: user.email },
  };
};

const signToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string =>
  jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as StringValue,
  });