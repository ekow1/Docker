import { Hono } from 'hono';
import { User } from '../models/user.js';

const users = new Hono();

// Get all users
users.get('/', async (c) => {
  try {
    const users = await User.findAll();
    return c.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({ success: false, error: 'Failed to fetch users' }, 500);
  }
});

// Get user by ID
users.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const user = await User.findById(id);
    
    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }
    
    return c.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return c.json({ success: false, error: 'Failed to fetch user' }, 500);
  }
});

// Create new user
users.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    if (!body.name || !body.email) {
      return c.json({ 
        success: false, 
        error: 'Name and email are required' 
      }, 400);
    }
    
    const user = await User.create(body);
    return c.json({ success: true, data: user }, 201);
  } catch (error) {
    console.error('Error creating user:', error);
    return c.json({ success: false, error: 'Failed to create user' }, 500);
  }
});

// Update user
users.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const success = await User.update(id, body);
    
    if (!success) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }
    
    return c.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    return c.json({ success: false, error: 'Failed to update user' }, 500);
  }
});

// Delete user
users.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const success = await User.delete(id);
    
    if (!success) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }
    
    return c.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return c.json({ success: false, error: 'Failed to delete user' }, 500);
  }
});

export default users;
