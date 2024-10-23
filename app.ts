import express, { Express } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { cartRoutes, productRoutes, userRoutes } from './routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development'
});

const app: Express = express();

app.use(bodyParser.json());

app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
