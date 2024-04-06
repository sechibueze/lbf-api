import { Request, Response } from 'express';

import { AppResponse } from '../libs/response.lib';
import { AccountService } from '../services/account.service';

export class AuthController {
  static async getCurrentUser(req: Request, res: Response) {
    return AppResponse.ok({
      res,
      message: 'Current user details!',
      data: req.user,
    });
  }
  static async login(req: Request, res: Response) {
    const result = await AccountService.loginUser(req.body);
    return AppResponse.ok({
      res,
      message: 'User login successfully!',
      data: result,
    });
  }

  static async verifyAccount(req: Request, res: Response) {
    const message = await AccountService.verifyAccount(
      req.body.email,
      req.body.token
    );
    return AppResponse.ok({ res, ...message });
  }
  static async resendToken(req: Request, res: Response) {
    const message = await AccountService.resendToken(req.body.email);
    return AppResponse.ok({ res, message: 'Account token has been sent!' });
  }
}
