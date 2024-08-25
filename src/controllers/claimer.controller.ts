import { Request, Response } from 'express';
import { ClaimerService } from '../services/claimer.service';
import { AppResponse } from '../libs/response.lib';
import { AppError } from '../utils/error.util';

export class ClaimerController {
  static async createClaimer(req: Request, res: Response): Promise<Response> {
    const { itemId } = req.params;
    const claimerData = req.body;

    try {
      const claimer = await ClaimerService.createClaimer(itemId, claimerData);
      return AppResponse.created({
        res,
        data: claimer,
        message: 'Claimer created',
      });
    } catch (error) {
      throw new AppError('Failed to clim item', 400);
    }
  }

  static async getClaimerByItemId(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { itemId } = req.params;

    try {
      const claimer = await ClaimerService.getClaimerByItemId(itemId);
      if (!claimer) {
        return AppResponse.bad({
          res,
          data: {},
          message: 'No claimer for this item',
        });
      }
      return AppResponse.ok({ res, message: 'Claimer found', data: claimer });
    } catch (error) {
      throw new AppError('Failed to get claimer', 401);
    }
  }

  static async getAllClaimers(req: Request, res: Response): Promise<Response> {
    try {
      const claimers = await ClaimerService.getAllClaimers();
      return AppResponse.ok({
        res,
        message: 'All Claimer found',
        data: claimers,
      });
    } catch (error) {
      throw new AppError('Failed to get claimer', 400);
    }
  }
}
