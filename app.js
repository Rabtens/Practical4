// Simple Node.js Express Application
const express = require('express');
const path = require('path');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static('public')); // Serve static files

// Sample data (in a real app, this would be a database)
let users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
];

// Routes
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Simple Node.js App</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .container { max-width: 600px; }
          button { padding: 10px 15px; margin: 5px; cursor: pointer; }
          .user { padding: 10px; border: 1px solid #ddd; margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to Simple Node.js App</h1>
          <p>This is a basic Express.js application with a simple API.</p>
          
          <h2>Available Endpoints:</h2>
          <ul>
            <li><strong>GET /</strong> - This home page</li>
            <li><strong>GET /api/users</strong> - Get all users</li>
            <li><strong>GET /api/users/:id</strong> - Get user by ID</li>
            <li><strong>POST /api/users</strong> - Create new user</li>
            <li><strong>PUT /api/users/:id</strong> - Update user</li>
            <li><strong>DELETE /api/users/:id</strong> - Delete user</li>
          </ul>

          <h2>Test the API:</h2>
          <button onclick="getUsers()">Get All Users</button>
          <button onclick="addUser()">Add Sample User</button>
          <div id="results"></div>

          <script>
            async function getUsers() {
              try {
                const response = await fetch('/api/users');
                const users = await response.json();
                document.getElementById('results').innerHTML = 
                  '<h3>Users:</h3>' + 
                  users.map(user => 
                    '<div class="user">' + 
                    '<strong>' + user.name + '</strong> - ' + user.email + 
                    '</div>'
                  ).join('');
              } catch (error) {
                console.error('Error:', error);
              }
            }

            async function addUser() {
              try {
                const response = await fetch('/api/users', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    name: 'New User',
                    email: 'newuser@example.com'
                  })
                });
                const user = await response.json();
                alert('User added: ' + user.name);
                getUsers(); // Refresh the list
              } catch (error) {
                console.error('Error:', error);
              }
            }
          </script>
        </div>
      </body>
    </html>
  `);
});

// API Routes
// Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

// Create new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name,
    email
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// Update user
app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const { name, email } = req.body;
  
  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;
  
  res.json(users[userIndex]);
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const deletedUser = users.splice(userIndex, 1)[0];
  res.json({ message: 'User deleted', user: deletedUser });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Try visiting http://localhost:${PORT} in your browser`);
});

module.exports = app;