import express, { Express } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { cartRoutes, productRoutes, userRoutes } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { createAdminUser } from './utils/createAdmin';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development'
});

const app: Express = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  createAdminUser().catch((error) => {
    console.error('Error creating admin user:', error);
  });;
  console.log(`Server is running on http://localhost:${PORT}`);
});
