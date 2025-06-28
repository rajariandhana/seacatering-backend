import express from 'express';

import authController from '../controllers/auth.controller';
import dummyController from '../controllers/dummy.controller';
import subscriptionController from '../controllers/subscription.controller';
import testimonialController from '../controllers/testimonial.controller';
import planController from '../controllers/plan.controller';

import authMiddleware from '../middleware/auth.middleware';

const router = express.Router();

router.get('/dummy', dummyController.dummy);

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authMiddleware, authController.me);

router.post('/subscription/create', subscriptionController.create);

router.get('/testimonial/find-all', testimonialController.findAll);
router.post('/testimonial/create', testimonialController.create);

router.get('/plan/find-all', planController.findAll);
router.post('/plan/create', planController.create);

export default router;