import mongoose from 'mongoose';
import { AppError } from '../src/utils/AppError';
import * as itemService from '../src/services/itemService';
import { Item } from '../src/models/Item';
import { SavedItem } from '../src/models/SavedItem';

// Mock the Mongoose models so no real DB connection is needed
jest.mock('../src/models/Item');
jest.mock('../src/models/SavedItem');

describe('itemService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // getItemById 

  describe('getItemById', () => {
    it('should throw AppError 400 for an invalid ObjectId', async () => {
      await expect(itemService.getItemById('not-a-valid-id')).rejects.toThrow(
        AppError
      );

      try {
        await itemService.getItemById('not-a-valid-id');
      } catch (err: any) {
        expect(err.statusCode).toBe(400);
        expect(err.message).toMatch(/invalid/i);
      }
    });

    it('should throw AppError 404 when the item does not exist', async () => {
      const validId = new mongoose.Types.ObjectId().toString();

      // Mock Item.findById().lean() to return null
      const leanMock = jest.fn().mockResolvedValue(null);
      (Item.findById as jest.Mock) = jest.fn().mockReturnValue({ lean: leanMock });

      try {
        await itemService.getItemById(validId);
      } catch (err: any) {
        expect(err).toBeInstanceOf(AppError);
        expect(err.statusCode).toBe(404);
        expect(err.message).toMatch(/not found/i);
      }
    });

    it('should return the item when it exists', async () => {
      const validId = new mongoose.Types.ObjectId().toString();
      const mockItem = {
        _id: validId,
        title: 'Test Item',
        description: 'A test description',
        category: 'programming',
      };

      const leanMock = jest.fn().mockResolvedValue(mockItem);
      (Item.findById as jest.Mock) = jest.fn().mockReturnValue({ lean: leanMock });

      const result = await itemService.getItemById(validId);

      expect(Item.findById).toHaveBeenCalledWith(validId);
      expect(result).toEqual(mockItem);
    });
  });

  // getItems 

  describe('getItems', () => {
    it('should return paginated results with defaults', async () => {
      const mockItems = [
        { _id: '1', title: 'Item 1', category: 'devops' },
        { _id: '2', title: 'Item 2', category: 'devops' },
      ];

      const leanMock = jest.fn().mockResolvedValue(mockItems);
      const limitMock = jest.fn().mockReturnValue({ lean: leanMock });
      const skipMock = jest.fn().mockReturnValue({ limit: limitMock });
      (Item.find as jest.Mock) = jest.fn().mockReturnValue({ skip: skipMock });
      (Item.countDocuments as jest.Mock) = jest.fn().mockResolvedValue(2);

      const result = await itemService.getItems({});

      expect(result.items).toHaveLength(2);
      expect(result.totalItems).toBe(2);
      expect(result.currentPage).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('should apply category filter when provided', async () => {
      const leanMock = jest.fn().mockResolvedValue([]);
      const limitMock = jest.fn().mockReturnValue({ lean: leanMock });
      const skipMock = jest.fn().mockReturnValue({ limit: limitMock });
      (Item.find as jest.Mock) = jest.fn().mockReturnValue({ skip: skipMock });
      (Item.countDocuments as jest.Mock) = jest.fn().mockResolvedValue(0);

      await itemService.getItems({ category: 'DevOps' });

      // Should lowercase the category
      expect(Item.find).toHaveBeenCalledWith({ category: 'devops' });
    });
  });

  // saveItem

  describe('saveItem', () => {
    it('should throw AppError 400 for an invalid itemId', async () => {
      const userId = new mongoose.Types.ObjectId().toString();

      try {
        await itemService.saveItem(userId, 'bad-id');
      } catch (err: any) {
        expect(err).toBeInstanceOf(AppError);
        expect(err.statusCode).toBe(400);
      }
    });

    it('should throw AppError 404 if item does not exist', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const itemId = new mongoose.Types.ObjectId().toString();

      const leanMock = jest.fn().mockResolvedValue(null);
      (Item.findById as jest.Mock) = jest.fn().mockReturnValue({ lean: leanMock });

      try {
        await itemService.saveItem(userId, itemId);
      } catch (err: any) {
        expect(err).toBeInstanceOf(AppError);
        expect(err.statusCode).toBe(404);
      }
    });

    it('should throw AppError 409 if item is already saved', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const itemId = new mongoose.Types.ObjectId().toString();

      const leanMock = jest.fn().mockResolvedValue({ _id: itemId });
      (Item.findById as jest.Mock) = jest.fn().mockReturnValue({ lean: leanMock });
      (SavedItem.findOne as jest.Mock) = jest.fn().mockResolvedValue({ _id: 'exists' });

      try {
        await itemService.saveItem(userId, itemId);
      } catch (err: any) {
        expect(err).toBeInstanceOf(AppError);
        expect(err.statusCode).toBe(409);
        expect(err.message).toMatch(/already saved/i);
      }
    });
  });
});
