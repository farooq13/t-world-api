import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getSavedItems } from '../controllers/itemController';

const router = Router();

/*
 route:  GET /me/saved
 Get saved items for the currently authenticated user
 access: Private
 */
router.get('/saved', authenticate, getSavedItems);

export default router;