import * as express from 'express';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.middleware';
import { validateRequest } from '../middlewares/validator.middleware';
import FileHandlerService from '../libs/file-upload.lib';
import { checkAuth, verifyUserRoles } from '../middlewares/auth.middleware';
import { appConfig } from '../constants/app.constant';
import { createLBFItemSchema } from '../schema/lbf-item.schema';
import { LBFItemController } from '../controllers/lbf-item.controller';

const router = express.Router();

/***
 * @method POST
 * @route /lbf-items
 * @query none
 * @params none
 * @access private
 * @role none
 * @body createLBFItemSchema
 * @description Create product
 */
const fileHandleService = new FileHandlerService({ provider: 'cloudinary' });
router.post(
  '/',
  catchAsyncErrors(
    checkAuth,
    verifyUserRoles(['admin']),
    fileHandleService.checkFile({
      fileSize: 500 * 1024,
      fileKey: 'image',
      fileType: 'image/',
      fileRequired: true,
    }),
    validateRequest(createLBFItemSchema),
    LBFItemController.registerLBFItem
  )
);
/***
 * @method PUT
 * @route /lbf-items/:itemId
 * @query none
 * @params itemId: string, UUID
 * @access private
 * @role none
 * @body
 * @description Update LBFItem
 */
router.put(
  '/:itemId',
  catchAsyncErrors(
    checkAuth,
    verifyUserRoles(['admin']),
    fileHandleService.checkFile({
      fileSize: 1 * 1024 * 1024, // 1mb
      fileKey: 'image',
      fileType: 'image/',
      fileRequired: false,
    }),
    LBFItemController.updateLBFItem
  )
);

/***
 * @method GET
 * @route /lbf-items/search
 * @query none
 * @params none
 * @access public
 * @role none
 * @body
 * @description Search and filter products
 */
router.get(
  '/search',
  catchAsyncErrors(LBFItemController.searchAndFilterLBFItems)
);

/***
 * @method GET
 * @route /lbf-items/:id
 * @query none
 * @params none
 * @access admin
 * @role none
 * @body
 * @description Get item
 */
router.get(
  '/:itemId',
  catchAsyncErrors(
    checkAuth,
    verifyUserRoles(['admin']),
    LBFItemController.getLBFItem
  )
);
/***
 * @method GET
 * @route /lbf-items
 * @query none
 * @params none
 * @access admin
 * @role none
 * @body
 * @description List items
 */
router.get(
  '/',
  catchAsyncErrors(
    checkAuth,
    verifyUserRoles(['admin']),
    LBFItemController.listLBFItems
  )
);

export default router;
