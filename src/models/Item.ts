import { Schema, model, Document } from 'mongoose';

export interface IItem extends Document {
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<IItem>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      lowercase: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for category filtering
itemSchema.index({ category: 1 });

export const Item = model<IItem>('Item', itemSchema);