import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';
import express from 'express';
const app = express();
const port = process.env.PORT || 5000;
import prisma from './types/prisma';
// Routes
import authRouter from './routes/authRoutes';
// Extra packages
import morgan from 'morgan';
// Middleware
import notFound from './middleware/notFound';
import errorHandlerMiddleware from './middleware/error-handler';

app.use(express.json());
app.use(morgan('tiny'));

app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.status(200).send('Hello world');
});

app.use(notFound);
app.use(errorHandlerMiddleware);

// Start app when connection to db successful
const start = async () => {
  try {
    await prisma.$connect();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
