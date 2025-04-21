const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, auto: true },
  userType: { type: String, enum: ["admin", "bettor"], required: true, default: "bettor"},
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  email: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  amountWon: { type: Number, default: 0 },
  amountLost: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
}, { collection: 'User' });  

const BetSchema = new mongoose.Schema({
  betID: { type: mongoose.Schema.Types.ObjectId, auto: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  odds: { type: Number, required: true },
  type: { type: String, enum: ["moneyline", "spread", "prop"], required: true },
  outcome: { type: String, default: null },
}, { collection: 'Bet' }); 

const WagerSchema = new mongoose.Schema({
  wagerID: { type: mongoose.Schema.Types.ObjectId, auto: true },
  betID: { type: mongoose.Schema.Types.ObjectId, ref: "Bet", required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  parlayID: { type: mongoose.Schema.Types.ObjectId, ref: "Parlay", default: null },
  amount: { type: Number, required: true },
  pickedOutcome: { type: String, required: true },
}, { collection: 'Wager' }); 

const ParlaySchema = new mongoose.Schema({
  parlayID: { type: mongoose.Schema.Types.ObjectId, auto: true },
  combinedOdds: { type: Number, required: true },
}, { collection: 'Parlay' }); 

const User = mongoose.model("User", UserSchema);
const Bet = mongoose.model("Bet", BetSchema);
const Wager = mongoose.model("Wager", WagerSchema);
const Parlay = mongoose.model("Parlay", ParlaySchema);

module.exports = { User, Bet, Wager, Parlay };
