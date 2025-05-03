const express = require('express');
const router = express.Router();
const controller = require('../controllers/gameController');

router.post('/join', controller.joinGame);
router.post('/solo', controller.soloPlay);
router.post('/play', controller.multiplayerPlay);
router.get('/history/:userId', controller.getHistoryByUser);
router.get('/shared', controller.getSharedHistory);

module.exports = router;