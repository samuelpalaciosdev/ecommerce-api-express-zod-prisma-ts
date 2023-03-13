import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';
import express from 'express';
const app = express();
const port = process.env.PORT || 5000;
import prisma from './services/prisma';
import corsOptions from './configs/corsOptions';
// Routes
import authRouter from './routes/authRoutes';
import userRouter from './routes/userRoutes';
import productRouter from './routes/productRoutes';
import brandRouter from './routes/brandRoutes';
import categoryRouter from './routes/categoryRoutes';
// Extra packages
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import fileUpload from 'express-fileupload';
// Middleware
import notFound from './middleware/notFound';
import errorHandlerMiddleware from './middleware/error-handler';

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(
  cookieParser([
    process.env.ACCESS_TOKEN_SECRET as string,
    process.env.REFRESH_TOKEN_SECRET as string,
  ])
);
app.use(fileUpload());
app.use(morgan('tiny'));

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/productBrand', brandRouter);
app.use('/api/productCategory', categoryRouter);

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
