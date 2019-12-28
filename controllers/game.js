'use strict'

const Questionnaire = require('../models/questionnaire');
const Game = require('../models/game');

module.exports = {

  // Returns a list of games
  async allGames(request, response) {
    const games = await Questionnaire.find()
      .sort('title')
      .select('title')
      .exec();
    response.render('game/games', { games });
  },

  // Shows a game with specific id
  async showGame(request, response) {
    const game = await Questionnaire.findById(request.params.id).exec();

    if (!game) {
      request.flash('errormessage', `Game not found by id: ${request.params.id}`);
      return response.redirect('/');
    }

    response.render('game/game', { game });
  },

  // Grading
  async grade(request, response) {
    var game = await Questionnaire.findById(request.params.id).exec();
    const result = Game.grade(request.body, game.questions);

    response.render('game/game-graded', {
      points: result.points,
      maxPoints: result.maxPoints,
      wrong: result.wrongAnswers,
      status: 'graded',
      description: 'game grader',
      title: 'A+ proccess'
    });
  }
};
