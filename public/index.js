const express = require('express');
const app = express();

// Game state
let players = [];
let currentRound = 1;
let totalScore = 0;

// Route to create a new game
app.post('/api/create-new-game', (req, res) => {
  const { numPlayers, playerNames } = req.body;
  
  players = playerNames.split(',').map(name => ({ name, seen: false, score: 0 }));
  
  res.json({ message: 'Game created successfully', round: 1 });
});

// Route to handle player actions
app.post('/api/handle-player-action', (req, res) => {
  const { action, playerId } = req.body;
  
  switch(action) {
    case 'toggle-seen':
      players[playerId].seen = !players[playerId].seen;
      break;
    case 'update-score':
      players[playerId].score = parseInt(req.body.score);
      break;
    case 'toggle-finished':
      players[playerId].finished = !players[playerId].finished;
      break;
  }

  res.json({ message: 'Action processed successfully' });
});

// Route to calculate round score
app.get('/api/calculate-round-score', (req, res) => {
  const unseenScore = players.filter(p => !p.seen).reduce((sum, p) => sum + p.score, 0);
  const seenScore = players.filter(p => p.seen).reduce((sum, p) => sum + p.score, 0);

  totalScore = unseenScore - (seenScore * players.length) + (players.length * 3);
  
  res.json({ totalScore, round: currentRound });
});

// Route to move to next round
app.get('/api/next-round', (req, res) => {
  currentRound++;
  res.json({ round: currentRound });
});

module.exports = app;