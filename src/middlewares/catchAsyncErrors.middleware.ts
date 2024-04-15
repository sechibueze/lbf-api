import { NextFunction, Request, Response } from 'express';

export const catchAsyncErrors = (
  ...routerHandlers: Array<
    (req: Request, res: Response, next: NextFunction) => Promise<any> | any // Adjust the type of handler
  >
) => {
  return routerHandlers.map((middleware) => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = middleware(req, res, next);

        if (result instanceof Promise) {
          result.catch(next);
        }
      } catch (error) {
        next(error);
      }
    };
  });
};
