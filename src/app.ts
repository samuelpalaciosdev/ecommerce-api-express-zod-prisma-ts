import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
const port = process.env.PORT || 5000;
import prisma from './types/prisma';
// Extra packages
import morgan from 'morgan';

app.use(express.json());
app.use(morgan('tiny'));

app.get('/', (req, res) => {
  res.status(200).send('Hello world');
});

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
