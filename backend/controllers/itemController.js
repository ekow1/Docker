import Item from '../models/Item.js';

// @desc    Get all items
// @route   GET /api/items
// @access  Public
export const getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
export const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new item
// @route   POST /api/items
// @access  Public
export const createItem = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        error: 'Name and description are required'
      });
    }
    
    const item = await Item.create({
      name,
      description
    });
    
    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error creating item:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Public
export const updateItem = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    let item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }
    
    item = await Item.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error updating item:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Public
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }
    
    await item.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
