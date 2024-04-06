import { Request, Response, NextFunction } from 'express';
import { AppResponse } from '../libs/response.lib';
import { appConfig } from '../constants/app.constant';
import jwt from 'jsonwebtoken';
import { AccountService } from '../services/account.service';

export const checkAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader?.split(' ')[1];

  if (!token) {
    return AppResponse.unauthorized({
      res,
      message: 'Unauthorized: No token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, appConfig.JWT_SECRET_KEY);

    const user = await AccountService.getUser('', decoded.userId);
    req.user = user;

    next();
  } catch (err) {
    return AppResponse.bad({ res, message: 'Forbidden: Invalid token' });
  }
};

export const verifyUserRoles = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return AppResponse.unauthorized({
        res,
        message: 'Unauthorized: No user information found',
      });
    }

    const userRole = req.user.role;

    // Check if user role is included in the allowed roles
    if (!allowedRoles.includes(userRole)) {
      return AppResponse.unauthorized({
        res,
        message: 'Forbidden: Insufficient permissions',
      });
    }

    next();
  };
};
