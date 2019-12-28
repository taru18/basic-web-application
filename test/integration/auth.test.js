
/* eslint-disable no-console */
/* eslint-disable babel/no-invalid-this */
'use strict';

require('dotenv').config();
const http = require('http');
const Browser = require('zombie');
const assert = require('assert');
const app = require('../../app.js');
const config = require('config');


const port = 3333;

const admin = config.get('admin');
const User = require('../../models/user');

// Zombie.js documentation can be found at: https://www.npmjs.com/package/zombie


const testUser = {
    name: 'Metkunen',
    email: 'zombie@underworld.fi',
    password: 'jopasjotakin12345',
    role: 'student'
};


describe('Authentication requirements', function () {

    let server;
    let browser;

    this.beforeAll(async function () {
        server = http.createServer(app).listen(port);
        Browser.localhost('bwa', port);
        browser = new Browser();
    });

    this.afterAll(async function () {

        await User.deleteOne({ email: testUser.email }, function (err) {
            if (err) console.log(err);
            else console.log('cleanup provided');
        });

        server.close();
    });

    it('should be able to login with just registered user', async function () {

        await browser.visit('/users/register');

        browser.fill('name', testUser.name);
        browser.fill('email', testUser.email);
        browser.fill('password', testUser.password);
        browser.fill('passwordConfirmation', testUser.password);

        await browser.pressButton('#btnRegister');

        browser.assert.success();

        await browser.visit('/users/login');
        await browser.fill('email', testUser.email);
        await browser.fill('password', testUser.password);
        await browser.pressButton('#btnLogin');
        browser.assert.success();

        browser.assert.url({ pathname: '/users/me' });
    });


    it('By default, the role of the registered user is student', async function () {
        //Expecting that the first test passed:
        browser.assert.text('.card-text', 'Role: student');
    });

    it('Registering the same user twice should cause an error', async function () {
        //Expecting that the first test passed
        await browser.visit('/users/logout');
        await browser.visit('/users/register');

        browser.fill('name', testUser.name);
        browser.fill('email', testUser.email);
        browser.fill('password', testUser.password);
        browser.fill('passwordConfirmation', testUser.password);

        await browser.pressButton('#btnRegister');
        browser.assert.url({ pathname: '/users/register' });
        browser.assert.text('.alert.alert-danger', 'Email already registered for another user.');
    });

    it('only admin can list users', async function () {
        await browser.visit('/users/login');
        await browser.fill('email', testUser.email);
        await browser.fill('password', testUser.password);
        await browser.pressButton('#btnLogin');

        await browser.visit('/users');
        browser.assert.url({ pathname: '/' });
        browser.assert.text('.alert.alert-danger', 'Admin rights required');
    });

    it('/users/me should show the information of the logged-in user', async function () {
        await browser.visit('/users/me');
        browser.assert.text('h5.card-title', testUser.name + testUser.email);
        browser.assert.text('.card-text', 'Role: student');
    });
});

