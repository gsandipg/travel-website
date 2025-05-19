const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // You missed importing path module

const app = express(); // ⬅️ This should come BEFORE using app.use()

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '../web/project/Client')));

// Routes
const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurant');
const User = require('./models/User');

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);

// View registered users (you can hide pin if needed)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find(); // To hide PIN: User.find({}, { pin: 0 })
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Connect to MongoDB and start server
mongoose.connect('mongodb://127.0.0.1:27017/travelDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
})
.catch(err => console.error('❌ MongoDB connection error:', err));
