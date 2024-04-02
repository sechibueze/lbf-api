import * as express from 'express';
import { UserController } from '../controllers/users.controller';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.middleware';
import { validateRequest } from '../middlewares/validator.middleware';
import { createUserSchema } from '../schema/user.schema';

const router = express.Router();

/***
 * @method POST
 * @route /users
 * @query none
 * @params none
 * @access public
 * @role none
 * @body createUserSchema
 * @description Create user account
 */
router.post(
  '/',
  catchAsyncErrors(validateRequest(createUserSchema), UserController.register)
);

export default router;
