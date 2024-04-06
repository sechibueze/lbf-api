import * as express from 'express';

const router = express.Router();
import usersRoute from './users.route';
import authRoute from './auth.route';

router.use('/auth', authRoute);
router.use('/users', usersRoute);

export default router;
