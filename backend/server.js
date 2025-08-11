import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import healthRoutes from './routes/health.js';
import itemRoutes from './routes/items.js';

// Import middleware
import { errorHandler, notFound, requestLogger } from './middleware/errorHandler.js';

// Import database connection
import connectDB from './config/database.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: ['https://api.ekowlabs.space', 'https://gcp.ekowlabs.space'],
  credentials: true
}));
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/', healthRoutes);
app.use('/api/items', itemRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: https://api.ekowlabs.space`);
  console.log(`🗄️  Database: db.ekowlabs.space`);
  console.log(`📊 Health Check: https://api.ekowlabs.space/api/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});
