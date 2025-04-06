const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());

app.use(express.json());

const uri = 'mongodb+srv://alviny:yfOWNs3HAKK3wyPX@paperpicks.mgiml.mongodb.net/?retryWrites=true&w=majority&appName=PaperPicks';

// Database name
const dbName = 'PaperPicks';

let db;

async function connectDB() {
    try {
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        await client.connect();
        db = client.db(dbName);

        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {

        const usersCollection = db.collection('User');
        const user = await usersCollection.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Compare plain text passwords
        if (password !== user.password) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/userProfile', async (req, res) => {

    const { username } = req.query;  // Get the username from query parameters

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        const usersCollection = db.collection('User');
        const user = await usersCollection.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user's profile data
        res.status(200).json({
            username: user.username,
            email: user.email,
            balance: user.balance,
            amountWon: user.amountWon,
            amountLost: user.amountLost,
            wins: user.wins,
            losses: user.losses,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Start the server
const PORT = 5001;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});