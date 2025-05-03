const Game = require('../models/Game');
const pool = require('../config/pgClient');
const { MOVES } = require('../constants/moves');

function determineWinner(p1, p2) {
  if (p1 === p2) return 0;
  if (
    (p1 === 'rock' && p2 === 'scissors') ||
    (p1 === 'paper' && p2 === 'rock') ||
    (p1 === 'scissors' && p2 === 'paper')
  ) return 1;
  return 2;
}

async function handleSoloGame(playerId, move) {
  const cpuMove = MOVES[Math.floor(Math.random() * MOVES.length)];
  const result = determineWinner(move, cpuMove);

  const round = {
    player1Move: move,
    player2Move: cpuMove,
    roundWinner: result === 0 ? null : result === 1 ? playerId : -1, // CPU = -1
  };

  const game = new Game({
    player1Id: playerId,
    player2Id: -1,
    rounds: [round],
    winnerId: round.roundWinner,
    isComplete: true,
  });
  await game.save();
  return { game, cpuMove };
}

async function handleMultiplayerMove(gameId, playerId, move) {
  const game = await Game.findById(gameId);
  if (!game || game.isComplete) throw new Error('Invalid game');

  const isP1 = playerId === game.player1Id;
  if (!isP1 && !game.player2Id) {
    game.player2Id = playerId;
  }

  if (!game.rounds.length || (game.rounds.at(-1).player1Move && game.rounds.at(-1).player2Move)) {
    game.rounds.push({});
  }

  const round = game.rounds.at(-1);
  if ((isP1 && round.player1Move) || (!isP1 && round.player2Move)) {
    throw new Error('Already submitted move this round');
  }

  if (isP1) round.player1Move = move;
  else round.player2Move = move;

  if (round.player1Move && round.player2Move) {
    const result = determineWinner(round.player1Move, round.player2Move);
    round.roundWinner = result === 0 ? null : result === 1 ? game.player1Id : game.player2Id;

    const p1Wins = game.rounds.filter(r => r.roundWinner === game.player1Id).length;
    const p2Wins = game.rounds.filter(r => r.roundWinner === game.player2Id).length;

    if (p1Wins === 2 || p2Wins === 2 || game.rounds.length === 3) {
      game.isComplete = true;
      game.winnerId = p1Wins > p2Wins ? game.player1Id : game.player2Id;
    }
  }

  await game.save();
  return game;
}

module.exports = { handleSoloGame, handleMultiplayerMove };