import { Router } from 'express';
import { ClaimerController } from '../controllers/claimer.controller';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.middleware';
import { checkAuth, verifyUserRoles } from '../middlewares/auth.middleware';

const router = Router();

router.post(
  '/:itemId',
  catchAsyncErrors(
    checkAuth,
    verifyUserRoles(['admin']),
    ClaimerController.createClaimer
  )
);
router.get(
  '/:itemId',
  catchAsyncErrors(
    checkAuth,
    verifyUserRoles(['admin']),
    ClaimerController.getClaimerByItemId
  )
);
router.get(
  '/',
  catchAsyncErrors(
    checkAuth,
    verifyUserRoles(['admin']),
    ClaimerController.getAllClaimers
  )
);

export default router;
