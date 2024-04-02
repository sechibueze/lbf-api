import express, { Application, Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes';
dotenv.config();

const app: Application = express();
const options: cors.CorsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true,
};

app.use(cookieParser());
app.use(cors(options));
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
  res.send('Hello, World!');
});

// Error handler middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

export default app;
