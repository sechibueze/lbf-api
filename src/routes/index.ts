import * as express from 'express';

const router = express.Router();
import usersRoute from './users.route';
import authRoute from './auth.route';
import ventureRoute from './venture.route';
import segmentRoute from './segment.route';
import productRoute from './product.route';

router.use('/auth', authRoute);
router.use('/users', usersRoute);
router.use('/ventures', ventureRoute);
router.use('/segments', segmentRoute);
router.use('/products', productRoute);

export default router;
