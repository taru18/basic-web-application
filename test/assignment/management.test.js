/* eslint-disable no-console */
'use strict';

require('dotenv').config();
const http = require('http');
const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');
const mongoose = require('mongoose');
const app = require('../../app');
const Questionnaire = require('../../models/questionnaire');

const admin = config.get('admin');
const User = require('../../models/user');

const expect = chai.expect;

chai.use(chaiHttp);

const loginUrl = '/users/login';
const newUrl = '/questionnaires/new';
const editUrl = '/questionnaires/edit/';
const deleteUrl = '/questionnaires/delete/';

describe('Game: A+ protocol', function () {
    let request;
    let user;
    let payload;

    before(async function () {
        try {
            // remove all users from the database and re-create admin user
            await User.deleteMany({});

            const userData = { ...admin, role: 'admin' };
            const user = new User(userData);
            await user.save();
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
            throw err;
        }
    });

    beforeEach(async function () {
        payload = {
            title: 'questionnaire1',
            submissions: 1,
            questions: [
                {
                    title: 'question1',
                    maxPoints: 1,
                    options: [
                        {
                            option: 'option1',
                            correctness: true
                        },
                        {
                            option: 'option2',
                            correctness: false
                        }
                    ]
                }
            ]
        };
        user = { ...admin };
        await request
            .post(loginUrl)
            .type('form')
            .send({
                email: user.email,
                password: user.password
            });
    });

    this.beforeAll(function (done) {
        request = chai.request.agent(app);
        done();
    });

    this.afterAll(function (done) {
        request.close(done);
    });

    describe('C: create', function () {
        it('should have create operation available', async function () {
            const response = await request
                .get(newUrl)
            expect(response.statusCode).not.to.equal(404);
        });
        it('should be able to create questionnaire succesfully', async function () {
            const response = await request
                .post(newUrl)
                .type('json')
                .send(payload);
            expect(response.statusCode).to.equal(200);
        });
        it('should not be able to create questionnaire without questions', async function () {
            payload.questions = [];
            const response = await request
                .post(newUrl)
                .type('json')
                .send(payload);
            expect(response.statusCode).to.equal(400);
        });
        it('should not be able to create questionnaire without title', async function () {
            payload.title = '';
            const response = await request
                .post(newUrl)
                .type('json')
                .send(payload);
            expect(response.statusCode).to.equal(400);
        });
        it('should not be able to create questionnaire without submissions', async function () {
            payload.submissions = 0;
            const response = await request
                .post(newUrl)
                .type('json')
                .send(payload);
            expect(response.statusCode).to.equal(400);
        });
    });

    describe('R: read ', function () {
        it('should have read operation available', async function () {
            const response = await request
                .get('/questionnaires')
            expect(response.statusCode).not.to.equal(404);
        });
    });

    describe('U: update', function () {
        it('should have update operation available', async function () {
            const questionnaire = await Questionnaire.findOne({ title: payload.title }).exec();
            const id = questionnaire._id;
            const response = await request
                .get(editUrl + id)
            expect(response.statusCode).not.to.equal(404);
        });
        it('should be able to edit existing questionnaire', async function () {
            let questionnaire = await Questionnaire.findOne({ title: payload.title }).exec();
            const id = questionnaire._id;
            payload.submissions = 4;
            const response = await request
                .post(editUrl + id)
                .type('json')
                .send(payload);
            expect(response.statusCode).to.equal(200);
            questionnaire = await Questionnaire.findOne({ title: payload.title }).exec();
            expect(questionnaire.submissions).to.equal(4);
        });
    });

    describe('D: delete', function () {
        it('should have delete operation available', async function () {
            const questionnaire = await Questionnaire.findOne({ title: payload.title }).exec();
            const id = questionnaire._id;
            let url = deleteUrl + id;
            const response = await request
                .get(url)
            expect(response.statusCode).not.to.equal(404);
        });
        it('should be able to delete questionnaire succesfully', async function () {
            const questionnaire = await Questionnaire.findOne({ title: payload.title }).exec();
            const id = questionnaire._id;
            let url = deleteUrl + id;
            const response = await request
                .post(url)
                .type('json');
            expect(response.statusCode).to.equal(200);
        });
        it('should not be able to delete questionnaire that doesnt exist', async function () {
            let url = deleteUrl + 'idThatIsntId';
            const response = await request
                .post(url)
                .type('json');
            expect(response.statusCode).to.equal(404);
        });
    });
});

