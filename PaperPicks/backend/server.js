const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { User, Bet }= require('./models');
const app = express();
const betRoutes = require('./routes/betting.js');

// Mongoose setup
const uri = 'mongodb+srv://alviny:yfOWNs3HAKK3wyPX@paperpicks.mgiml.mongodb.net/?retryWrites=true&w=majority&appName=PaperPicks';
const dbName = 'PaperPicks';

// Connect to MongoDB using Mongoose
mongoose.connect(uri, { dbName })
  .then(() => console.log('Connected to MongoDB using Mongoose'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());




app.use('/betting', betRoutes);

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

app.put('/updateProfile', async (req, res) => {
  console.log('Received update request body:', req.body);
  const { userID, ...updateFields } = req.body;

  try {
    const result = await User.updateOne( // Use the Mongoose User model
      { userID },
      { $set: updateFields }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'User not found or no changes made' });
    }

    res.status(200).json({ message: 'Profile updated' });
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

app.get('/leaderboard', async (req, res) => {
  const { type = 'amountWon' } = req.query;

  // Only allow sorting by certain numeric fields
  const validTypes = ['amountWon', 'balance'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: 'Invalid leaderboard type. Choose "amountWon" or "balance".' });
  }

  try {
    // Return top 10 players sorted by the chosen metric
    const leaderboard = await User.find({ userType: 'bettor' })
      .sort({ [type]: -1 })
      .limit(10)
      .select('username balance amountWon amountLost wins losses'); // choose which fields to return

    res.status(200).json(leaderboard);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/history', async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) return res.status(400).json({ error: 'Username required' });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const bets = await Bet.find({ userID: user._id })
      .sort({ _id: -1 })

    const history = bets.map((bet) => ({
      betID: bet._id,
      title: bet.title,
      description: bet.description,
      odds: bet.odds,
      type: bet.type,
      outcome: bet.outcome,
    }));

    res.json(history);
  } catch (err) {
    console.error('Error fetching bet history:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
