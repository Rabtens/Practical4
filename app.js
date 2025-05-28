const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample data
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', active: true },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', active: true }
];

// Helper functions
const findUserById = (id) => users.find(user => user.id === parseInt(id));
const getNextId = () => users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Node.js Jenkins CI/CD Demo',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      health: '/health',
      status: '/status'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Status endpoint
app.get('/status', (req, res) => {
  res.json({
    service: 'nodejs-jenkins-app',
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// User API endpoints
app.get('/api/users', (req, res) => {
  const activeUsers = users.filter(user => user.active);
  res.json({
    success: true,
    count: activeUsers.length,
    data: activeUsers
  });
});

app.get('/api/users/:id', (req, res) => {
  const user = findUserById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  if (!user.active) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  res.json({
    success: true,
    data: user
  });
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Name and email are required'
    });
  }
  
  // Check if email already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'Email already exists'
    });
  }
  
  const newUser = {
    id: getNextId(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    active: true
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser
  });
});

app.put('/api/users/:id', (req, res) => {
  const user = findUserById(req.params.id);
  
  if (!user || !user.active) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  const { name, email } = req.body;
  
  if (name) user.name = name.trim();
  if (email) {
    // Check if email already exists for another user
    const existingUser = users.find(u => u.email === email && u.id !== user.id);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }
    user.email = email.trim().toLowerCase();
  }
  
  res.json({
    success: true,
    message: 'User updated successfully',
    data: user
  });
});

app.delete('/api/users/:id', (req, res) => {
  const user = findUserById(req.params.id);
  
  if (!user || !user.active) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  // Soft delete
  user.active = false;
  
  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server (only if not in test environment)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;