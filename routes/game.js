'use strict';

const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const GameController = require('../controllers/game');

router.use(auth.ensureStudent);

// Show games
router.get('/', GameController.allGames);
router.get('/:id([a-f0-9]{24})', GameController.showGame);

// Start grading
router.post('/:id([a-f0-9]{24})', GameController.grade);

module.exports = router;
