import mongoose from 'mongoose';

// @desc    Get system health
// @route   GET /api/health
// @access  Public
export const getHealth = async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.status(200).json({
      success: true,
      status: 'OK',
      service: 'Backend API',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      status: 'ERROR',
      error: 'Health check failed'
    });
  }
};

// @desc    Get API info
// @route   GET /
// @access  Public
export const getApiInfo = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Docker Backend API is running on api.ekowlabs.space!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        items: '/api/items',
        createItem: 'POST /api/items',
        getItem: 'GET /api/items/:id',
        updateItem: 'PUT /api/items/:id',
        deleteItem: 'DELETE /api/items/:id'
      },
      documentation: 'See README.md for API documentation'
    });
  } catch (error) {
    console.error('API info error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get API info'
    });
  }
};
