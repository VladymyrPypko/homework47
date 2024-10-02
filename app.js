import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { cartRoutes, productRoutes, userRoutes } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(bodyParser.json());
dotenv.config();

app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
