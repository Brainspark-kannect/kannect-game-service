const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  player1Move: String,
  player2Move: String,
  roundWinner: Number,
});

const gameSchema = new mongoose.Schema({
  player1Id: { type: Number, required: true },
  player2Id: { type: Number },
  rounds: [roundSchema],
  winnerId: Number,
  isComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Game', gameSchema);