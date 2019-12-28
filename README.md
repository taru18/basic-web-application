# Basic web applications coursework assignment

In the assignment, we gamified multi-choice questionnaire.
The project consists of three parts: the game, management view, and testing/documentation.

1. game - some mechanism for selecting the right answers. This part is all my work. Parts 2 and 3 are implemented by team members.
2. management implies CRUD operations: questions can be created, queried, modified, and deleted.
3. test your modifications, that is game and management view in particular, other tests can be implemented as well.

### The project structure

```
.
├── app.js                  --> express app
├── index.js                --> bwa app
├── package.json            --> app info and dependencies
├── controllers             --> controllers (handle e.g. routing)
│   ├──  ...                -->   ...
│   └── hello.js            --> the same as "minimal viable grader"
├── models                  --> models that reflect the db schemes
│                               and take care of storing data
├── public                  --> location for public (static) files
│   ├── img                 --> for images
│   ├── js                  --> for javascript
│   └── css                 --> for styles
├── routes                  --> a dir for router modules
│   ├── hello.js            --> / (root) router
│   ├──  ...                -->   ...
│   └── users.js            --> /users router
├── views                   --> views - visible parts
│   ├── error.hbs           --> error view
│   ├── hello.hbs           --> main view - "minimal viable grader"
│   ├── layouts             --> layouts - handlebar concept
│   │   └── layout.hbs      --> layout view, "template" to be rendered
│   └── partials            --> smaller handlebar components to be included in views
└── test                    --> tests
│   ├── assignment          --> student made tests
│   ├── integration         --> integration tests
└── └── models              --> unit tests for models


```
Files created by our team
```
|–– controllers
|   |-- game.js             --> fetches the games from the database
|   └-- questionnaire.js    --> Implementation of methods given at questionnaire router
|–– models
|   └–– game.js             --> game grader implementation
|–– routes
|   |–– game.js             --> /game router
|   └–– questionnaire.js    --> /questionnaire router
|–– test
|   |–– assignment             
|       └–– management.test.js --> Basic CRUD funtionality and availability test
|–– views
|   |–– game                --> layouts for showing games and results
|   |–– questionnaire       --> Layouts for listing and showing questionnaires. Layouts for creating new, deleting and editing questionnaires.

```

## Game

First we implemented a controller and a router for the game. GameController searches for the games from database and sends them to the site as a response. Different views are for showing and playing the games. 
The grader implementation can be found from models. It goes through the questions and checks if the player has the right ones selected. We decided to show maximum points and also the amount of wrong answers. In this game the player loses points after answering incorrectly.

## Management view

With management view admins and teacher can do various things with questionnaires. Management view is created in questionnaire router and questionnaire controller. First methods list all questionnaires and by clicking the questionnaire it shows how it looks.
Also in the management view there is functionality for creating new questionnaires. Button for creating new questionnaire is found in the /questionnaires. We tried really hard but we didn't manage to do this method right. 
Unfortunately admins and teachers can't add more than one question for the questionnaire and 5 options for the question (2 right answers and 3 wrong answers).
Editing method allows to edit chosen questionnaire. Editing button is found when the some of the questionnaires is clicked (/questionnaires/questionnaire.id). Editing allows to change the questionnaire's title and number of submissions. Unfortunately we didn't find a way to change
the questions.
Lastly deleting method allows admin and teacher to delete questionnaires. Delete button is found next to editing button (/questionnaires/questionnaire.id). The method deletes the chosen questionnaire.

## Tests and documentation

Testing is done for questionnaire. Basic funtionality and availability of CRUD is tested using Mocha and Chai.
The testing is a bit narrow due to problems with getting management view working, but all the most important stuff is there.

## Security concerns

Various common web vulnerabilities Protected using Helmet.
Cross-Site Request Forgery protected using csurf.

---

## Coding conventions

Project uses _express_ web app framework (https://expressjs.com/).
The application starts from `index.js` that in turn calls other modules.  
The actual _express_ application is created and configured in `app.js` and
routes in `router.js`.

The application complies with the _MVC_ model, where each route has
a corresponding _controller_ in the dir of `controllers`.
Controllers, in turn, use the models for getting and storing data.
The models centralize the operations of e.g. validation, sanitation
and storing of data (i.e., _business logic_) to one location.
Having such a structure also enables more standard testing.

As a _view_ component, the app uses _express-handlebars_;
actual views are put in the dir named `views`. It has two subdirectories:
`layouts` and `partials`.
`layouts` are whole pages, whereas `partials` are reusable smaller
snippets put in the `layouts` or other views. Views, layouts, and partials
use _handlebars_ syntax, and their extension is `.hbs`.
More information about _handlebars_ syntax can be found in: http://handlebarsjs.com/

Files such as images, _CSS_ styles, and clientside JavaScripts are under the `public` directory. When the app is run in a browser, the files are located under the`/`path, at the root of the server, so the views must refer to them using the absolute path. (For example, `<link rel =" stylesheet "href =" / css / style.css ">`) ** Note that `public` is not part of this path. **

The _mocha_ and _chai_ modules are used for testing and the tests can be found under the `test` directory.

## Installation

1. Install `nodejs` and `npm`, if not already installed.
2. Execute in the root, in the same place, where _package.json_-file is):
    ```
    npm install
    ```

3. **Copy** `.env.dist` in the root with the name `.env` (note the dot in the beginning of the file)
    ```
    cp -i .env.dist .env
    ```
    **Obs: If `.env`-file already exists, do not overwrite it!**
    **Note: Do not save `.env` file to the git repository - it contains sensitive data!**
    **Note: Do not modify `.env.dist` file. It is a model to be copied as .env, it neither must not contain any sensitive data!**
    Modify `.env` file and set the needed environment variables.

    In the real production environment, passwords need to be
    long and complex. Actually, after setting them, one does
    not need to memorize them or type them manually.

4. `Vagrantfile` is provided. It defines how the vagrant
   environment is set up, commands to be run:
    `vagrant up` //sets up the environment
    `vagrant ssh` //moves a user inside vagrant
    Inside vagrant, go to the directory `/bwa` and start the app:
    `npm start`

5. As an other alternative, `Dockerfile` is provided as well.
   Then, docker and docker-compile must be installed.
   In the root, give:
    ```
    docker-compose build && docker-compose up
    ```
    or
    ```
    docker-compose up --build
    ```
    The build phase should be needed only once. Later on you should omit the build phase and simply run:
    ```
    docker-compose up
    ```
    The container is started in the terminal and you can read what is written to console.log. The container is stopped with `Ctrl + C`.
    Sometimes, if you need to rebuild the whole docker container from the very beginning,
    it can be done with the following command:
    ```
    docker-compose build --no-cache --force-rm && docker-compose up
    ```

6. Docker container starts _bwa_ server and listens `http://localhost:3000/`
7. Docker container is stopped in the root dir with a command:
    ```
    docker-compose down
    ```