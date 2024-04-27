import * as express from 'express';
import { AuthService } from '../services/auth.service';
import RabbitMQService from '../libs/message-queue.lib';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.middleware';
import { validateRequest } from '../middlewares/validator.middleware';
import { createSegmentSchema } from '../schema/segment.schema';
import { SegmentController } from '../controllers/segment.controller';
import FileHandlerService from '../libs/file-upload.lib';
import { checkAuth, verifyUserRoles } from '../middlewares/auth.middleware';
import { appConfig } from '../constants/app.constant';

const router = express.Router();

/***
 * @method POST
 * @route /segments
 * @query none
 * @params none
 * @access private
 * @role none
 * @body createSegmentSchema
 * @description Create segments
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
    }),
    validateRequest(createSegmentSchema),
    fileHandleService.uploadFile({ folder: `${appConfig.APP_ID}/segments` }),
    SegmentController.createSegment
  )
);

/***
 * @method GET
 * @route /segments
 * @query none
 * @params none
 * @access public
 * @role none
 * @body
 * @description List segments
 */
router.get('/', SegmentController.listSegments);

export default router;
