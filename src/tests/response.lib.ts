import { Response } from 'express';
import { AppResponse } from '../libs/response.lib';

const mockResponse = () => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  return res as Response;
};

describe('AppResponse', () => {
  describe('ok', () => {
    it('should return a 200 status with valid response', () => {
      const res = mockResponse();
      const data = { key: 'value' };
      const message = 'Success';

      AppResponse.ok({ res, data, message });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        valid: true,
        message,
        data,
        errors: null,
      });
    });
  });

  describe('created', () => {
    it('should return a 201 status with valid response', () => {
      const res = mockResponse();
      const data = { key: 'value' };
      const message = 'Created';

      AppResponse.created({ res, data, message });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        valid: true,
        message,
        data,
        errors: null,
      });
    });
  });

  describe('bad', () => {
    it('should return a 400 status with invalid response', () => {
      const res = mockResponse();
      const errors = { field: 'Error message' };
      const message = 'Bad response';

      AppResponse.bad({ res, errors, message });

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        valid: false,
        message,
        data: null,
        errors,
      });
    });
  });

  describe('unauthorized', () => {
    it('should return a 401 status with unauthorized response', () => {
      const res = mockResponse();
      const errors = { field: 'Error message' };
      const message = 'Unauthorized';

      AppResponse.unauthorized({ res, errors, message });

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        valid: false,
        message,
        data: null,
        errors,
      });
    });
  });

  describe('serverError', () => {
    it('should return a 500 status with server error response', () => {
      const res = mockResponse();
      const errors = { field: 'Error message' };
      const message = 'Internal server error';

      AppResponse.serverError({ res, errors, message });

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        valid: false,
        message,
        data: null,
        errors,
      });
    });
  });
});
