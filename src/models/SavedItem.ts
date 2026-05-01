import { Schema, model, Document, Types } from 'mongoose';

export interface ISavedItem extends Document {
  userId: Types.ObjectId;
  itemId: Types.ObjectId;
  savedAt: Date;
}

const savedItemSchema = new Schema<ISavedItem>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound unique index – prevents a user from saving the same item twice
savedItemSchema.index({ userId: 1, itemId: 1 }, { unique: true });

export const SavedItem = model<ISavedItem>('SavedItem', savedItemSchema);