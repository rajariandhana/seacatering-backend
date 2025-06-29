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
import memberController from '../controllers/member.controller';

const router = express.Router();

router.get('/dummy', dummyController.dummy);

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authMiddleware, authController.me);

router.get('/members', [authMiddleware, aclMiddleware([ROLES.ADMIN])], memberController.index);
router.get('/member/subscription', [authMiddleware, aclMiddleware([ROLES.ADMIN])], memberController.subscription);

router.get('/subscriptions', [authMiddleware, aclMiddleware([ROLES.ADMIN])], subscriptionController.index);
router.post('/subscription', [authMiddleware, aclMiddleware([ROLES.MEMBER])], subscriptionController.create);
router.get('/subscription', [authMiddleware, aclMiddleware([ROLES.MEMBER])], subscriptionController.show);
router.patch('/subscription', [authMiddleware, aclMiddleware([ROLES.MEMBER])], subscriptionController.togglePause);
router.delete('/subscription', [authMiddleware, aclMiddleware([ROLES.MEMBER])], subscriptionController.delete)

router.get('/testimonials', testimonialController.index);
router.post('/testimonial', testimonialController.create);

router.get('/plans', planController.index);
router.get('/plan', planController.show);
router.post('/plan', planController.create);
router.patch('/plan', planController.update);
router.delete('/plan', planController.delete);

export default router;