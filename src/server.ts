import app from './app';
import { AppDataSource } from './config/database.config';

const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been conected!');
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source connection', err);
  });
