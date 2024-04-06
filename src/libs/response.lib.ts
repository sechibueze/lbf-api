import { Response } from 'express';

enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  SERVER_ERROR = 500,
}

interface ApiInput {
  res: Response;
  message: string;
  data?: any;
  errors?: any;
}
interface ApiResponse {
  valid: boolean;
  message: string;
  data?: any;
  errors?: string;
}

export abstract class AppResponse {
  static send(
    res: Response,
    status: HttpStatus,
    data: any = {},
    message: string = '',
    errors: string = ''
  ) {
    const response: ApiResponse = {
      valid: status < 400,
      message: message || (status < 400 ? 'Success' : 'Error'),
      data: data,
      errors: errors || null,
    };
    return res.status(status).json(response);
  }

  static ok({ res, data, message }: ApiInput) {
    return AppResponse.send(res, HttpStatus.OK, data, message);
  }

  static created({ res, data, message }: ApiInput) {
    return AppResponse.send(res, HttpStatus.CREATED, data, message);
  }

  static bad({ res, errors, message }: ApiInput) {
    return AppResponse.send(res, HttpStatus.BAD_REQUEST, null, message, errors);
  }

  static unauthorized({ res, message, errors }: ApiInput) {
    return AppResponse.send(
      res,
      HttpStatus.UNAUTHORIZED,
      null,
      message,
      errors
    );
  }

  static serverError({ res, data, message, errors }: ApiInput) {
    return AppResponse.send(
      res,
      HttpStatus.SERVER_ERROR,
      null,
      message,
      errors
    );
  }
}
