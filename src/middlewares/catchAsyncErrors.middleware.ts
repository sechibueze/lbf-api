import { NextFunction, Request, Response } from 'express';

export const catchAsyncErrors = (
  ...routerHandlers: Array<
    (req: Request, res: Response, next: NextFunction) => {}
  >
) => {
  return routerHandlers.map((middleware) => {
    return (req: Request, res: Response, next: NextFunction) =>
      Promise.resolve(middleware(req, res, next)).catch(next);
  });
};
