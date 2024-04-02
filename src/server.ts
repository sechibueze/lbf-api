import app from './app';

const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
