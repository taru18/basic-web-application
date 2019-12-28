'use strict';

// load routers
const UsersRouter = require('./routes/users');
const HelloRouter = require('./routes/hello');
const QuestionnairesRouter = require('./routes/questionnaire');
const GameRouter = require('./routes/game');

// Setup Routes
module.exports = function (app) {
    app.use('/users', UsersRouter);
    app.use('/', HelloRouter);
    app.use('/questionnaires', QuestionnairesRouter);
    app.use('/game', GameRouter);
};
