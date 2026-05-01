import { Router } from 'express';
import { query } from 'express-validator';
import * as itemController from '../controllers/itemController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100.'),
  query('category').optional().isString().trim(),
];

/*
 route:  GET /items
 Get paginated list of items, optionally filtered by category
 Access: Public
 */
router.get('/', paginationValidation, validate, itemController.getItems);

/*
 route: GET /items/:id
 Get a single item by ID
 access:  Public
 */
router.get('/:id', itemController.getItemById);

/*
 route:  POST /items/:id/save
 Save an item for the authenticated user
 Access Private
 */
router.post('/:id/save', authenticate, itemController.saveItem);

/*
 route  DELETE /items/:id/save
 Remove a saved item for the authenticated user
 Access: Private
 */
router.delete('/:id/save', authenticate, itemController.unsaveItem);

export default router;