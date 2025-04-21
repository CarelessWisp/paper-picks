const express = require('express');
const router = express.Router(); // your Bet model

const { Bet } = require('../models');

// Create Bet Route
router.post('/createBet', async (req, res) => {
  const { userID, title, description, odds, type } = req.body;

  // Basic presence check
  if (!userID || !title || !description || odds === undefined || !type) {
    return res
      .status(400)
      .json({ message: 'All fields are required: userID, title, description, odds, and type.' });
  }

  // Field-specific validation
  if (typeof title !== 'string' || title.trim().length < 1 || title.length > 100) {
    return res.status(400).json({ message: 'Title must be between 1 and 100 characters.' });
  }

  if (
    typeof description !== 'string' ||
    description.trim().length < 1 ||
    description.length > 500
  ) {
    return res.status(400).json({ message: 'Description must be between 1 and 500 characters.' });
  }

  if (typeof odds !== 'number' || isNaN(odds) || odds <= 0 || odds > 1000) {
    return res
      .status(400)
      .json({ message: 'Odds must be a number greater than 0 and less than or equal to 1000.' });
  }

  const validTypes = ['moneyline', 'spread', 'prop'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: `Type must be one of: ${validTypes.join(', ')}` });
  }

  try {
    const newBet = new Bet({
      userID: userID,
      title: title.trim(),
      description: description.trim(),
      odds: odds,
      type: type,
    });

    await newBet.save();

    res.status(201).json({ message: 'Bet created successfully', bet: newBet });
  } catch (error) {
    console.error('Create bet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bets
router.get('/getBets', async (req, res) => {
  try {
    const bets = await Bet.find().sort({ _id: -1 });
    res.status(200).json(bets);
  } catch (error) {
    console.error('Fetch bets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// READ: Get all bets for a user
router.get('/userBets/:userID', async (req, res) => {
  const { userID } = req.params;

  try {
    const bets = await Bet.find({ userID });
    res.status(200).json(bets);
  } catch (error) {
    console.error('Get user bets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// READ: Get a specific bet by ID
router.get('/:betID', async (req, res) => {
  const { betID } = req.params;

  try {
    const bet = await Bet.findById(betID);
    if (!bet) {
      return res.status(404).json({ message: 'Bet not found' });
    }
    res.status(200).json(bet);
  } catch (error) {
    console.error('Get bet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE a bet (e.g., outcome or odds/title update)
router.put('/update/:betID', async (req, res) => {
  const { betID } = req.params;
  const { title, description, odds, type, outcome } = req.body;

  try {
    const updatedBet = await Bet.findByIdAndUpdate(
      betID,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(odds !== undefined && { odds }),
        ...(type && { type }),
        ...(outcome !== undefined && { outcome }),
      },
      { new: true },
    );

    if (!updatedBet) {
      return res.status(404).json({ message: 'Bet not found' });
    }

    res.status(200).json({ message: 'Bet updated', bet: updatedBet });
  } catch (error) {
    console.error('Update bet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a bet
router.delete('/delete/:betID', async (req, res) => {
  const { betID } = req.params;

  try {
    const deletedBet = await Bet.findByIdAndDelete(betID);

    if (!deletedBet) {
      return res.status(404).json({ message: 'Bet not found' });
    }

    res.status(200).json({ message: 'Bet deleted successfully' });
  } catch (error) {
    console.error('Delete bet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
