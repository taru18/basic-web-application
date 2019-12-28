'use strict';

const Questionnaire = require('../models/questionnaire');

module.exports = {

    async list(request, response) {
        const questionnaires = await Questionnaire.find()
            .sort('title')
            .select('title')
            .exec();
        response.render('questionnaire/questionnaires', { questionnaires });
    },

    async show(request, response) {
        const questionnaire = await Questionnaire.findById(request.params.id).exec();

        if (!questionnaire) {
            request.flash(
                'errorMessage',
                `Questionnaire not found (id: ${request.params.id})`
            );
            return response.redirect('/questionnaires');
        }
        response.render('questionnaire/questionnaire', { questionnaire });

    },

    async create(request, response) {
        response.render('questionnaire/new');
    },

    async processCreate(request, response) {
        const { error } = Questionnaire.validateQuestionnaire(request.body);
        const { title, submissions, questions } = request.body;

        if (error) {
            if (request.is('json')) {
                return response.status(400).json({ error });
            }
            return response.render('questionnaire/new', {
                title,
                submissions,
                questions,
                errors: error
            });
        }

        let questionnaire = new Questionnaire();
        questionnaire.title = title;
        questionnaire.submissions = submissions;
        questionnaire.questions = questions;

        await questionnaire.save();

        request.flash(
            'successMessage',
            'New questionnaire created.'
        );
        response.redirect('/questionnaires');
    },

    async update(request, response) {
        const questionnaire = await Questionnaire.findById(request.params.id).exec();

        response.render('questionnaire/edit', { questionnaire });
    },

    async processUpdate(request, response) {
        const { newTitle, newSubmissions } = request.body;

        await Questionnaire.findOneAndUpdate({ _id: request.params.id }, { title: newTitle });
        await Questionnaire.findOneAndUpdate({ _id: request.params.id }, { submissions: newSubmissions });

        request.flash('successMessage', 'Questionnaire updated successfully.');
        response.redirect('/questionnaires');
    },

    async delete(request, response) {
        const questionnaire = await Questionnaire.findById(request.params.id).exec();

        response.render('questionnaire/delete', { questionnaire });
    },

    async processDelete(request, response) {
        await Questionnaire.findByIdAndDelete(request.params.id).exec();
        request.flash('successMessage', 'Questionnaire removed successfully.');
        response.redirect('/questionnaires');

    }
};