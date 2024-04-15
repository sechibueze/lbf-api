import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import streamifier from 'streamifier';
import {
  UploadApiOptions,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import AWS from 'aws-sdk';
import { appConfig } from '../constants/app.constant';

interface FileHandlerOptions {
  provider: 'cloudinary' | 'S3';
}

class FileHandlerService {
  private upload: multer.Multer;
  private provider: string;
  private filedName: string;

  constructor(private options: FileHandlerOptions) {
    // Configure multer
    this.upload = multer({ storage: multer.memoryStorage() });
    this.provider = options.provider;
    // Configure AWS if provided
    if (options.provider === 'S3') {
      AWS.config.update({
        accessKeyId: '',
        secretAccessKey: '',
      });
    }

    // Configure Cloudinary if provided
    if (options.provider === 'cloudinary') {
      cloudinary.config({
        secure: true,
        cloud_name: appConfig.CLOUDINARY_CLOUD_NAME,
        api_key: appConfig.CLOUDINARY_API_KEY,
        api_secret: appConfig.CLOUDINARY_API_SECRET,
      });
    }
  }
  uploadFile(options: UploadApiOptions) {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (this.provider === 'cloudinary') {
        const result = await this.uploadToCloudinary(req.file, options);
        req.body[this.filedName || 'file'] = result.secure_url;
        next();
      }
    };
  }

  // Middleware function to pload file to appropriate service
  checkFile(options: {
    fileKey: string;
    fileSize?: number;
    fileType?: string;
  }) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { fileKey } = options || {};
      this.upload.single(fileKey || 'file')(req, res, async (err: any) => {
        if (err) {
          next(err);
        }

        try {
          if (!req.file) {
            next(new Error('No file uploaded.'));
            return;
          }

          // Validate file size and type
          const { fileSize, fileType } = options || {};
          if (fileSize && req.file.size > fileSize) {
            next(new Error('File size exceeds the limit.'));
            return;
          }
          if (fileType && !req.file.mimetype.startsWith(fileType)) {
            next(new Error('Invalid file type.'));
            return;
          }
          this.filedName = fileKey;
          // file is valid
          next();
        } catch (error) {
          throw new Error(error.message);
        }
      });
    };
  }

  private async uploadToS3(req: any, res: any, next: any) {
    try {
      const s3 = new AWS.S3();
      //   const { accessKeyId, secretAccessKey, bucketName } = this.options || {};
      const bucketName = '';
      const params = {
        Bucket: bucketName,
        Key: `${Date.now()}_${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const uploadResult = await s3.upload(params).promise();

      // Add URL to req.body
      req.body.fileUrl = uploadResult.Location;
      next();
    } catch (error) {
      next(error);
    }
  }

  private async uploadToCloudinary(
    file: Express.Multer.File,
    options: UploadApiOptions = {}
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadOptions: UploadApiOptions = {
        folder: options.folder || `${appConfig.APP_ID}`,
        use_filename: true,
        unique_filename: true,

        ...options,
      };
      const stream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (err, result: UploadApiResponse) => {
          if (result) {
            resolve(result);
          } else {
            reject(err);
          }
        }
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  }
}

export default FileHandlerService;
