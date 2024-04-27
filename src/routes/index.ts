import * as express from 'express';

const router = express.Router();
import usersRoute from './users.route';
import authRoute from './auth.route';
import lbfItemRoute from './lbf_item.route';

router.use('/auth', authRoute);
router.use('/users', usersRoute);
router.use('/lbf-items', lbfItemRoute);

export default router;
