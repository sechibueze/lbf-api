import { Request, Response } from 'express';
import { AppResponse } from '../libs/response.lib';
import { UserService } from '../services/user.service';

export class UserController {
  static async register(req: Request, res: Response) {
    const result = await UserService.createUser(req.body);
    return AppResponse.created({
      res,
      message: 'User account created',
      data: result,
    });
  }
}
