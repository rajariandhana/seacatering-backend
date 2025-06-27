import express from 'express';

import dummyController from '../controllers/dummy.controller';
import subscriptionController from '../controllers/subscription.controller';

const router = express.Router();

router.get('/dummy', dummyController.dummy);
router.post('/subscription/subscribe', subscriptionController.subscribe);

export default router;