import { Request, Response, NextFunction } from 'express';
import { validateSchema } from '../libs/validateInput.lib';
import { AppResponse } from '../libs/response.lib';

export const validateRequest = (schema: object) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { data: validInput, errors: validationErrors } = validateSchema(
      schema,
      req.body
    );

    if (!validInput)
      return AppResponse.bad({
        res,
        errors: validationErrors,
        message: 'Wooops! Some errors to fix',
      });
    next();
  };
};
