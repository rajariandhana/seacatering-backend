import express from 'express';

import authController from '../controllers/auth.controller';
import dummyController from '../controllers/dummy.controller';
import subscriptionController from '../controllers/subscription.controller';

import authMiddleware from '../middleware/auth.middleware';

const router = express.Router();

router.get('/dummy', dummyController.dummy);
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authMiddleware, authController.me);
router.post('/auth/activation', authController.activation);
router.post('/subscription/subscribe', subscriptionController.subscribe);

export default router;