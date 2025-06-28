import express from 'express';

import { Request, Response } from 'express';

import authController from '../controllers/auth.controller';
import dummyController from '../controllers/dummy.controller';
import subscriptionController from '../controllers/subscription.controller';
import testimonialController from '../controllers/testimonial.controller';
import planController from '../controllers/plan.controller';

import { ROLES } from '../utils/constant';
import authMiddleware from '../middleware/auth.middleware';
import aclMiddleware from '../middleware/acl.middleware';

const router = express.Router();

router.get('/dummy', dummyController.dummy);

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authMiddleware, authController.me);

// router.post('/subscription/create', subscriptionController.create);
router.post('/subscription', [authMiddleware, aclMiddleware([ROLES.MEMBER])], subscriptionController.subscribe);
router.get('/subscription', [authMiddleware, aclMiddleware([ROLES.MEMBER])], subscriptionController.memberSubscription);
router.patch('/subscription', [authMiddleware, aclMiddleware([ROLES.MEMBER])], subscriptionController.togglePause);
router.delete('/subscription', [authMiddleware, aclMiddleware([ROLES.MEMBER])], subscriptionController.unsubscribe)

router.get('/testimonial/find-all', testimonialController.findAll);
router.post('/testimonial/create', testimonialController.create);

router.get('/plan/find-all', planController.findAll);
router.post('/plan/create', planController.create);

export default router;