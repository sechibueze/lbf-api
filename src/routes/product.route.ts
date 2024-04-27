import * as express from 'express';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.middleware';
import { validateRequest } from '../middlewares/validator.middleware';
import FileHandlerService from '../libs/file-upload.lib';
import {
  checkAuth,
  verifyMembershipTypes,
  verifyUserRoles,
} from '../middlewares/auth.middleware';
import { appConfig } from '../constants/app.constant';
import { createProductSchema } from '../schema/product.schema';
import { ProductController } from '../controllers/product.controller';

const router = express.Router();

/***
 * @method POST
 * @route /products
 * @query none
 * @params none
 * @access private
 * @role none
 * @body createProductSchema
 * @description Create product
 */
const fileHandleService = new FileHandlerService({ provider: 'cloudinary' });
router.post(
  '/',
  catchAsyncErrors(
    checkAuth,
    verifyUserRoles(['user']),
    verifyMembershipTypes(['w']),
    fileHandleService.checkFile({
      fileSize: 500 * 1024,
      fileKey: 'image',
      fileType: 'image/',
      fileRequired: true,
    }),
    validateRequest(createProductSchema),
    ProductController.createProduct
  )
);
/***
 * @method PUT
 * @route /products/:productId
 * @query none
 * @params productId: string, UUID
 * @access private
 * @role none
 * @body
 * @description Update product
 */
router.put(
  '/:productId',
  catchAsyncErrors(
    checkAuth,
    verifyUserRoles(['user']),
    fileHandleService.checkFile({
      fileSize: 500 * 1024,
      fileKey: 'image',
      fileType: 'image/',
      fileRequired: false,
    }),
    ProductController.updateProduct
  )
);

/***
 * @method GET
 * @route /products
 * @query none
 * @params none
 * @access admin
 * @role none
 * @body
 * @description List products
 */
router.get(
  '/',
  catchAsyncErrors(
    checkAuth,
    verifyUserRoles(['admin']),
    ProductController.listProducts
  )
);

/***
 * @method GET
 * @route /products/me
 * @query {}
 * @params none
 * @access private
 * @role none
 * @body
 * @description List user products
 */
router.get(
  '/me',
  catchAsyncErrors(
    checkAuth,
    verifyUserRoles([`user`]),
    ProductController.listUserProducts
  )
);
/***
 * @method GET
 * @route /products/search
 * @query none
 * @params none
 * @access public
 * @role none
 * @body
 * @description Search and filter products
 */
router.get(
  '/search',
  catchAsyncErrors(ProductController.searchAndFilterProducts)
);

export default router;
