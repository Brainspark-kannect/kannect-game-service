const Game = require('../models/Game');
const { enqueue, dequeue } = require('../utils/matchmakingQueue');
const { handleSoloGame, handleMultiplayerMove } = require('../services/gameService');
const { MOVE_IMAGES } = require('../constants/moves');
const pool = require('../config/pgClient');

exports.joinGame = async (req, res) => {
  const { playerId } = req.body;
  const waiting = dequeue();
  if (!waiting) {
    enqueue(playerId);
    return res.status(200).json({ message: 'Waiting for opponent...' });
  }

  const game = new Game({ player1Id: waiting, player2Id: playerId });
  await game.save();
  return res.status(201).json({ message: 'Game started', game });
};

exports.soloPlay = async (req, res) => {
  const { playerId, move } = req.body;
  try {
    const { game, cpuMove } = await handleSoloGame(playerId, move);
    return res.status(200).json({
      statusCode: 200,
      status: 'OK',
      message: 'Solo game played',
      data: {
        round: game.rounds[0],
        cpuMove,
        moveImages: MOVE_IMAGES,
        winnerId: game.winnerId,
      },
    });
  } catch (err) {
    return res.status(400).json({ statusCode: 400, status: 'BAD_REQUEST', message: err.message });
  }
};

exports.multiplayerPlay = async (req, res) => {
  const { gameId, playerId, move } = req.body;
  try {
    const game = await handleMultiplayerMove(gameId, playerId, move);
    return res.status(200).json({
      statusCode: 200,
      status: 'OK',
      message: 'Move registered',
      data: {
        roundCount: game.rounds.length,
        rounds: game.rounds,
        winnerId: game.winnerId,
        moveImages: MOVE_IMAGES,
      },
    });
  } catch (err) {
    return res.status(400).json({ statusCode: 400, status: 'BAD_REQUEST', message: err.message });
  }
};

exports.getHistoryByUser = async (req, res) => {
  const userId = parseInt(req.params.userId);
  const games = await Game.find({ $or: [{ player1Id: userId }, { player2Id: userId }] });
  return res.status(200).json({
    statusCode: 200,
    status: 'OK',
    message: 'User game history',
    data: games,
  });
};

exports.getSharedHistory = async (req, res) => {
  const user1 = parseInt(req.query.user1);
  const user2 = parseInt(req.query.user2);
  const games = await Game.find({
    $or: [
      { player1Id: user1, player2Id: user2 },
      { player1Id: user2, player2Id: user1 },
    ],
  });
  return res.status(200).json({
    statusCode: 200,
    status: 'OK',
    message: 'Shared history',
    data: games,
  });
};