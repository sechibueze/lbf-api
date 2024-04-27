import { Request, Response } from 'express';
import { AppResponse } from '../libs/response.lib';
import { ProductService } from '../services/product.service';
import FileHandlerService from '../libs/file-upload.lib';
import { appConfig } from '../constants/app.constant';
import { AppError } from '../utils/error.util';
import { Product } from '../entities/product.entity';
import { AppDataSource as dataSource } from '../config/database.config';
import { DeepPartial } from 'typeorm';

const fileHandlerService = new FileHandlerService({ provider: 'cloudinary' });
export class ProductController {
  static async createProduct(req: Request, res: Response) {
    const currentUser = req.user;
    // TODO : Confirm that user is wholesaler
    const storageFolder = `${appConfig.APP_ID}/${currentUser.id}/products`;
    const storageResult = await fileHandlerService.uploadToStorage(req.file, {
      folder: storageFolder,
    });
    req.body.image = storageResult.secure_url;
    req.body.owner = currentUser.id;
    const newProduct = await ProductService.createProduct(req.body);
    // TODO - Send message to Queue

    return AppResponse.created({
      res,
      message: 'Product created!',
      data: newProduct,
    });
  }
  static async updateProduct(req: Request, res: Response) {
    const currentUser = req.user;
    const productId = req.params.productId;
    if (!productId) throw new AppError('Product ID is required', 400);
    const productRepository = dataSource.getRepository(Product);
    try {
      const existingProduct = await productRepository.findOneOrFail({
        where: {
          id: productId,
          owner: {
            id: currentUser.id,
          },
        },
        relations: {
          segment: true,
        },
      });

      if (req.file) {
        const storageFolder = `${appConfig.APP_ID}/${currentUser.id}/products`;
        const storageResult = await fileHandlerService.uploadToStorage(
          req.file,
          {
            folder: storageFolder,
          }
        );
        req.body.image = storageResult.secure_url;
      }
      const {
        name: productName,
        amount: productAmount,
        unit: productUnit,
        description: productDesc,
        tags: productTags,
        segment_id: segmentId,
        image: productImage,
      } = req.body;
      const product = {
        name: productName,
        amount: productAmount || existingProduct.amount,
        unit: productUnit || existingProduct.unit,
        description: productDesc || existingProduct.description,
        image: productImage || existingProduct.image,
        tags: productTags || existingProduct.tags,
        segment: segmentId || existingProduct.segment.id,
        owner: currentUser.id,
      };

      const updatedProduct = await productRepository.update(
        productId,
        product as DeepPartial<Product>
      );
      // TODO - Send message to Queue
      return AppResponse.ok({
        res,
        message: 'Product updated successfully!!',
        data: { id: existingProduct.id },
      });
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }
  static async listProducts(req: Request, res: Response) {
    const productList = await ProductService.listProducts();
    return AppResponse.ok({
      res,
      message: 'Product list!',
      data: productList,
    });
  }
  static async listUserProducts(req: Request, res: Response) {
    try {
      const currentUser = req.user;

      const resultSet = await ProductService.searchAndFilterProducts({
        ...req.query,
        ownerId: currentUser.id,
      });
      return AppResponse.ok({
        res,
        message: 'Product list!',
        data: resultSet,
      });
    } catch (error) {
      throw new AppError(error.message);
    }
  }
  static async searchAndFilterProducts(req: Request, res: Response) {
    try {
      const resultSet = await ProductService.searchAndFilterProducts(req.query);
      return AppResponse.ok({
        res,
        message: 'Product list!',
        data: resultSet,
      });
    } catch (error) {
      throw new AppError(error.message);
    }
  }
}
