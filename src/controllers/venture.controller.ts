import { Request, Response } from 'express';
import { AppResponse } from '../libs/response.lib';
import { VentureService } from '../services/venture.service';

export class VentureController {
  static async createVenture(req: Request, res: Response) {
    const newVenture = { owner: req.user.id, ...req.body };
    if (!req.user.is_verified_email) {
      return AppResponse.bad({
        res,
        message: `You need to verify your account before adding your business`,
      });
    }
    const venture = await VentureService.createVenture(newVenture);
    return AppResponse.created({
      res,
      message: 'Venture created successfully',
      data: venture,
    });
  }
  static async listVentures(req: Request, res: Response) {
    const ventures = await VentureService.listVentures({});
    return AppResponse.ok({
      res,
      message: 'Venture list',
      data: ventures,
    });
  }
}
