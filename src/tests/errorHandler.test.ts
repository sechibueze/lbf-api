import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.middleware';
import { Request, Response } from 'express';

describe('catchAsyncErrors.middeware.ts', () => {
  it('should return an array of wrapped route handler functions', () => {
    const mockHandler1 = jest.fn();
    const mockHandler2 = jest.fn();
    const wrappedHandlers = catchAsyncErrors(mockHandler1, mockHandler2);

    expect(wrappedHandlers).toHaveLength(2);

    wrappedHandlers.forEach((wrappedHandler) => {
      expect(typeof wrappedHandler).toBe('function');

      const req = {} as Request;
      const res = {} as Response;
      const next = jest.fn();

      wrappedHandler(req, res, next);

      expect(mockHandler1).toHaveBeenCalledWith(req, res, next);
      expect(mockHandler2).toHaveBeenCalledWith(req, res, next);
    });
  });

  it('should catch and pass any asynchronous errors to next function', async () => {
    const mockHandler = jest
      .fn()
      .mockRejectedValueOnce(new Error('Test Error'));
    const wrappedHandler = catchAsyncErrors(mockHandler)[0];

    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    await wrappedHandler(req, res, next);

    expect(mockHandler).toHaveBeenCalledWith(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error('Test Error'));
  });
});
