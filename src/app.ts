import express, { Application, Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes';
import { AppResponse } from './libs/response.lib';
import { User } from './entities/user.entity';
dotenv.config();
const app: Application = express();

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const options: cors.CorsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true,
};

app.use(cookieParser());
app.use(cors(options));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,Content-Type'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  // Pass to next layer of middleware
  next();
});

// Routing
app.use('/api', apiRoutes);
app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    message: `We are busy ATM building Pamundo!`,
  });
});

// Error handler middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  return AppResponse.serverError({
    res,
    message: err.message,
    errors: err,
  });
});

export default app;
