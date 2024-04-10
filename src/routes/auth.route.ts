import * as express from 'express';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.middleware';
import { validateRequest } from '../middlewares/validator.middleware';
import { loginUserSchema } from '../schema/user.schema';
import { AuthController } from '../controllers/auth.controller';
import {
  forgotPasswordSchema,
  resendTokenSchema,
  resetPasswordSchema,
  verifyAccountSchema,
} from '../schema/auth.schema';
import { checkAuth } from '../middlewares/auth.middleware';

const router = express.Router();

/***
 * @method GET
 * @route /auth/me
 * @query none
 * @params none
 * @access private
 * @role User
 * @body none
 * @description Get current user
 */
router.get('/me', catchAsyncErrors(checkAuth, AuthController.getCurrentUser));
/***
 * @method POST
 * @route /auth/resend-token
 * @query none
 * @params none
 * @access public
 * @role none
 * @body resendTokenSchema
 * @description Resend Account Token
 */
router.post(
  '/resend-token',
  catchAsyncErrors(
    validateRequest(resendTokenSchema),
    AuthController.resendToken
  )
);

/***
 * @method POST
 * @route /auth/verify-account
 * @query none
 * @params none
 * @access public
 * @role none
 * @body verifyAccountSchema
 * @description Account login
 */
router.post(
  '/verify-account',
  catchAsyncErrors(
    validateRequest(verifyAccountSchema),
    AuthController.verifyAccount
  )
);
/***
 * @method POST
 * @route /auth
 * @query none
 * @params none
 * @access public
 * @role none
 * @body loginUserSchema
 * @description Account login
 */
router.post(
  '/',
  catchAsyncErrors(validateRequest(loginUserSchema), AuthController.login)
);
/***
 * @method PUT
 * @route /auth/forgot-password
 * @query none
 * @params none
 * @access public
 * @role none
 * @body forgotPasswordSchema
 * @description Send password reset token
 */
router.put(
  '/forgot-password',
  catchAsyncErrors(
    validateRequest(forgotPasswordSchema),
    AuthController.sendPasswordResetToken
  )
);
/***
 * @method PUT
 * @route /auth/reset-password
 * @query none
 * @params none
 * @access public
 * @role none
 * @body resetPasswordSchema
 * @description Reset password
 */
router.put(
  '/reset-password',
  catchAsyncErrors(
    validateRequest(resetPasswordSchema),
    AuthController.resetPassword
  )
);

export default router;
