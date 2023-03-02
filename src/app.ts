import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';
import express from 'express';
const app = express();
const port = process.env.PORT || 5000;
import prisma from './services/prisma';
// Routes
import authRouter from './routes/authRoutes';
import userRouter from './routes/userRoutes';
// Extra packages
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// Middleware
import notFound from './middleware/notFound';
import errorHandlerMiddleware from './middleware/error-handler';

app.use(express.json());
app.use(morgan('tiny'));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

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
