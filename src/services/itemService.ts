import mongoose from 'mongoose';
import { Item } from '../models/Item';
import { SavedItem } from '../models/SavedItem';
import { AppError } from '../utils/AppError';

export interface GetItemsQuery {
  page?: number;
  limit?: number;
  category?: string;
}

export const getItems = async ({ page = 1, limit = 10, category }: GetItemsQuery) => {
  const filter: Record<string, unknown> = {};
  if (category) filter.category = category.toLowerCase();

  const skip = (page - 1) * limit;
  const [items, totalItems] = await Promise.all([
    Item.find(filter).skip(skip).limit(limit).lean(),
    Item.countDocuments(filter),
  ]);

  return {
    items,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: page,
  };
};

export const getItemById = async (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Invalid item ID format.', 400);
  }

  const item = await Item.findById(id).lean();
  if (!item) {
    throw new AppError('Item not found.', 404);
  }
  return item;
};

export const saveItem = async (userId: string, itemId: string) => {
  if (!mongoose.isValidObjectId(itemId)) {
    throw new AppError('Invalid item ID format.', 400);
  }

  // Verify the item exists
  const item = await Item.findById(itemId).lean();
  if (!item) {
    throw new AppError('Item not found.', 404);
  }

  // Check for duplicates
  const exists = await SavedItem.findOne({ userId, itemId });
  if (exists) {
    throw new AppError('Item is already saved.', 409);
  }

  const savedItem = await SavedItem.create({ userId, itemId });
  return savedItem;
};

export const unsaveItem = async (userId: string, itemId: string) => {
  if (!mongoose.isValidObjectId(itemId)) {
    throw new AppError('Invalid item ID format.', 400);
  }

  const result = await SavedItem.findOneAndDelete({ userId, itemId });
  if (!result) {
    throw new AppError('Saved item not found.', 404);
  }
};

export const getSavedItems = async (userId: string) => {
  const savedItems = await SavedItem.find({ userId })
    .populate('itemId')
    .sort({ savedAt: -1 })
    .lean();

  return savedItems.map((si) => ({
    item: si.itemId,
    savedAt: si.savedAt,
  }));
};