import { Request, Response } from 'express';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppResponse } from '../libs/response.lib';

export class UserController {
  static async register(req: Request, res: Response) {
    return AppResponse.ok({ res, message: 'valid user input', data: req.body });
  }
}
