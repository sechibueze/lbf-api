import { Request, Response } from 'express';
import { AppResponse } from '../libs/response.lib';
import { AccountService } from '../services/account.service';

export class UserController {
  static async register(req: Request, res: Response) {
    const result = await AccountService.createUserAndBusiness(req.body);
    return AppResponse.ok({
      res,
      message: 'User account created',
      data: result,
    });
  }
}
