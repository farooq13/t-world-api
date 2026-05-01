import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // never return password in queries by default
    },
  },
  { timestamps: true }
);

// Index for fast login lookups (unique already creates one, this is explicit)
userSchema.index({ email: 1 }, { unique: true });

export const User = model<IUser>('User', userSchema);