import * as express from 'express';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.middleware';
import { validateRequest } from '../middlewares/validator.middleware';
import { createVentureSchema } from '../schema/venture.schema';
import { VentureController } from '../controllers/venture.controller';
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
/***
 * @method GET
 * @route /ventures
 * @query none
 * @params none
 * @access public
 * @role none
 * @body createUserSchema
 * @description Create venture account
 */
router.get('/', catchAsyncErrors(checkAuth, VentureController.listVentures));

export default router;
