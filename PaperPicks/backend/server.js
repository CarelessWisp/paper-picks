const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const betRoutes = require('./routes/betting.js');

// Mongoose setup
const uri = 'mongodb+srv://alviny:yfOWNs3HAKK3wyPX@paperpicks.mgiml.mongodb.net/?retryWrites=true&w=majority&appName=PaperPicks';
const dbName = 'PaperPicks';

// Define the user schema with Mongoose
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  email: { type: String, unique: true },  // Added email field
  balance: { type: Number, default: 0 },
  amountWon: { type: Number, default: 0 },
  amountLost: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);

// Connect to MongoDB using Mongoose
mongoose.connect(uri, { dbName })
  .then(() => console.log('Connected to MongoDB using Mongoose'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

app.use('/api/betting', betRoutes);

// Signup route using Mongoose
app.post('/signup', async (req, res) => {
    const { email, username, password } = req.body;
    console.log(req)
  
    if (!username || !password) {
      return res.status(400).json({ message: 'Email, Username and password required' });
    }
  
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }      
      
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(409).json({ message: 'Username already exists' });
      }

  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        email,
        username,
        password: hashedPassword, 
      });
  
      await newUser.save();
  
      res.status(201).json({ message: 'User created' });
    } catch (err) {
      console.error('Signup error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// Login route using Mongoose
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        return res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Profile route using Mongoose
app.get('/userProfile', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    // Find the user by username using Mongoose
    const user = await User.findOne({ username });

    if (!user || !user._id) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      userID: user._id,
      username: user.username,
      email: user.email,
      balance: user.balance,
      amountWon: user.amountWon,
      amountLost: user.amountLost,
      wins: user.wins,
      losses: user.losses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.delete('/deleteAccount', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required to delete account' });
  }

  try {
    const deletedUser = await User.findOneAndDelete({ username });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
