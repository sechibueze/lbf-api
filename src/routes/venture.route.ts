import * as express from 'express';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.middleware';
import { validateRequest } from '../middlewares/validator.middleware';
import { createVentureSchema } from '../schema/venture.schema';
import { VentureController } from '../controllers/vendor.controller';
import { checkAuth } from '../middlewares/auth.middleware';

const router = express.Router();

/***
 * @method POST
 * @route /ventures
 * @query none
 * @params none
 * @access public
 * @role none
 * @body createUserSchema
 * @description Create venture account
 */
router.post(
  '/',
  catchAsyncErrors(
    checkAuth,
    validateRequest(createVentureSchema),
    VentureController.createVenture
  )
);

export default router;
