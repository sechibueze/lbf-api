import * as express from 'express';

const router = express.Router();
import usersRoute from './users.route';

router.use('/users', usersRoute);

export default router;
