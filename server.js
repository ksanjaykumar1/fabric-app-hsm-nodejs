import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import notFound from './middleware/notFound.js';
import morgan from 'morgan';
import errorHandler from './middleware/errorHandler.js';
import { fabriSetup } from './utils/fabric-setup.js';
dotenv.config();
import identity from './routes/identity.js';
import transactions from './routes/transactions.js';

const { PORT, NODE_ENV } = process.env;
const app = express();
const port = PORT || 3000;
app.use(express.json());
if (NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use('/api/v1/identity', identity);
app.use('/api/v1/transactions', transactions);

app.use(notFound);
app.use(errorHandler);
const start = async () => {
  try {
    await fabriSetup();
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
