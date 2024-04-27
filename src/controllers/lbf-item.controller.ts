import { Request, Response } from 'express';
import { AppResponse } from '../libs/response.lib';
import { LBFItemService } from '../services/lbf-item.service';
import FileHandlerService from '../libs/file-upload.lib';
import { appConfig } from '../constants/app.constant';
import { AppError } from '../utils/error.util';
import { LBFItem } from '../entities/lbf-item.entity';
import { AppDataSource as dataSource } from '../config/database.config';
import { DeepPartial } from 'typeorm';
import { AuthService } from '../services/auth.service';

const fileHandlerService = new FileHandlerService({ provider: 'cloudinary' });
export class LBFItemController {
  static async registerLBFItem(req: Request, res: Response) {
    const currentUser = req.user;

    const storageFolder = `${appConfig.APP_ID}/${currentUser.id}/lbf-items`;
    const storageResult = await fileHandlerService.uploadToStorage(req.file, {
      folder: storageFolder,
    });
    req.body.image = storageResult.secure_url;
    req.body.token = AuthService.generateVerificationToken();

    const newIItem = await LBFItemService.registerLBFItem(req.body);

    return AppResponse.created({
      res,
      message: 'Item created!',
      data: newIItem,
    });
  }
  static async updateLBFItem(req: Request, res: Response) {
    const currentUser = req.user;
    const itemId = req.params.itemId;
    if (!itemId) throw new AppError('Item ID is required', 400);
    const lbfItemRepository = dataSource.getRepository(LBFItem);
    try {
      const existingItem = await lbfItemRepository.findOneOrFail({
        where: {
          id: itemId,
        },
      });

      if (req.file) {
        const storageFolder = `${appConfig.APP_ID}/${currentUser.id}/lbf-items`;
        const storageResult = await fileHandlerService.uploadToStorage(
          req.file,
          {
            folder: storageFolder,
          }
        );
        req.body.image = storageResult.secure_url;
      }
      const {
        name: lbfItemName,
        description: lbfItemDesc,
        tags: lbfItemTags,
        pickup_point: lbfItemPickupPoint,
        image: lbfItemImage,
      } = req.body;
      const lbfItem = {
        name: lbfItemName || existingItem.name,
        description: lbfItemDesc || existingItem.description,
        pickup_point: lbfItemPickupPoint || existingItem.pickup_point,
        image: lbfItemImage || existingItem.image,
        tags: lbfItemTags || existingItem.tags,
      };

      const updatedProduct = await lbfItemRepository.update(
        itemId,
        lbfItem as DeepPartial<LBFItem>
      );

      return AppResponse.ok({
        res,
        message: 'Item updated successfully!!',
        data: { id: existingItem.id },
      });
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }
  static async listLBFItems(req: Request, res: Response) {
    const itemsList = await LBFItemService.listLBFItems();
    return AppResponse.ok({
      res,
      message: 'LBF Items list!',
      data: itemsList,
    });
  }
  static async getLBFItem(req: Request, res: Response) {
    const lbfItem = await LBFItemService.getLBFItem({
      itemId: req.params.itemId,
    });
    return AppResponse.ok({
      res,
      message: 'LBF Item!',
      data: lbfItem,
    });
  }
  static async searchAndFilterLBFItems(req: Request, res: Response) {
    try {
      const resultSet = await LBFItemService.searchAndFilterLBFItems(req.query);
      return AppResponse.ok({
        res,
        message: 'Items list!',
        data: resultSet,
      });
    } catch (error) {
      throw new AppError(error.message);
    }
  }
}
