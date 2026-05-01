import { Request, Response, NextFunction } from 'express';
import * as itemService from '../services/itemService';

export const getItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit as string, 10) || 10, 100);
    const category = req.query.category as string | undefined;

    const query: itemService.GetItemsQuery = { page, limit };
    if (category) query.category = category;

    const result = await itemService.getItems(query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getItemById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const item = await itemService.getItemById(req.params.id);
    res.status(200).json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

export const saveItem = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const savedItem = await itemService.saveItem(userId, req.params.id);
    res.status(201).json({
      success: true,
      message: 'Item saved successfully.',
      savedItem,
    });
  } catch (error) {
    next(error);
  }
};

export const unsaveItem = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    await itemService.unsaveItem(userId, req.params.id);
    res.status(200).json({
      success: true,
      message: 'Item removed from saved.',
    });
  } catch (error) {
    next(error);
  }
};

export const getSavedItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const savedItems = await itemService.getSavedItems(userId);
    res.status(200).json({ success: true, savedItems });
  } catch (error) {
    next(error);
  }
};