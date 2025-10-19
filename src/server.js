import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import categoryRoutes from './routes/categories.js';
import subCategoryRoutes from './routes/subcategories.js';
import itemRoutes from './routes/items.js';
import { errorHandler, notFound } from './middleware/error.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// DB
await connectDB(process.env.MONGODB_URI);

// Health
app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'menu-management-api' });
});

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subCategoryRoutes);
app.use('/api/items', itemRoutes);

// 404 + Error handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
