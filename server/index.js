'use strict';

/*** Importing modules ***/
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dayjs = require("dayjs");

/*** Importing DAOs ***/
const riddleDao = require("./riddleDao");
const userDao = require('./userDao');
const answerDao = require("./answerDao");

const {validationResult, body, param} = require('express-validator'); // validation middleware


/** Authentication-related imports **/
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');


/*** init express and set-up the middlewares ***/
const app = express();
app.use(morgan('dev'));
app.use(express.json());


/** Set up and enable CORS **/
const corsOptions = {
    origin: 'http://localhost:3000', credentials: true,
};
app.use(cors(corsOptions));


/*** Passport ***/

passport.use(new LocalStrategy(async function verify(email, password, cb) {
    const user = await userDao.getUser(email, password)
    if (!user) {

        return cb(null, false, 'Incorrect username or password');
    }
    return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (user, cb) {
    return cb(null, user);
});


app.use(session({
    secret: "Secret Recipe", resave: false, saveUninitialized: false,
}));

app.use(passport.authenticate('session'));


/*** Defining authentication verification middleware ***/

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({error: 'User not authorized!'});
}


/*** Users APIs ***/

// Route used for performing login.
app.post('/api/sessions', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({error: info});
        }
        // success, perform the login and extablish a login session
        req.login(user, (err) => {
            if (err)  return next(err);

            return res.status(200).json(req.user);
        });
    })(req, res, next);
});



// This route checks whether the user is logged in or not.
app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    } else res.status(401).json({error: 'User not authenticated!'});
});


// This route is used for loggin out the current user.
app.delete('/api/sessions/current', (req, res) => {
    req.logout(() => {
        res.status(200).json({});
    });
});

/*** Riddles APIs ***/

//GET all riddles depending on logged in user
app.get('/api/riddles', async (req, res) => {
    try {
        const riddles = await riddleDao.listAllRiddles();
        let final;
        if (req.isAuthenticated()) { //If Logged-In return only not authored
            final = riddles.filter((rid) => {
                return rid.authorId !== req.user.userId
            });
        } else {
            final = riddles;
        }
        res.status(200).json(final.map((rid) => {
            return {
                riddleId: rid.riddleId,
                name: rid.name,
                text: rid.text,
                difficulty: rid.difficulty,
                state: rid.state,
                duration: rid.duration,
                hint1: rid.hint1,
                hint2: rid.hint2,
                authorId: rid.authorId,
                endDate: rid.endDate,
                solution: rid.solution
            }
        }));
    } catch (err) {
        res.status(500).json({error: "Internal Server Error"});
    }
});
//GET riddles created by logged-in user
app.get('/api/my-riddles', isLoggedIn, async (req, res) => {
    try {
        const riddles = await riddleDao.listAllRiddles();
        let final = riddles.filter((rid) => {
            return rid.authorId === req.user.userId
        });
        res.status(200).json(final.map((rid) => {
            return {
                riddleId: rid.riddleId,
                name: rid.name,
                text: rid.text,
                difficulty: rid.difficulty,
                state: rid.state,
                duration: rid.duration,
                hint1: rid.hint1,
                hint2: rid.hint2,
                authorId: rid.authorId,
                solution: rid.solution,
                endDate: rid.endDate
            }
        }));
    } catch (err) {
        res.status(500).json({error: "Internal Server Error"});
    }
});

//GET the riddle object with answer if exists for logged-in user .
app.get('/api/riddles/:riddleId', isLoggedIn, param("riddleId").isInt({min: 1}), async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(422).json({error: "ID parameter is not Valid"});
    }
    try {
        const riddle = await riddleDao.getRiddleById(req.params.riddleId);
        if (riddle === undefined) {
            res.status(404).json({error: "Riddle not found"});
        }
        let answer = await answerDao.alreadyAnswered(req.params.riddleId, req.user.userId);
        let hasAnswered;
        if (answer === undefined) {
            answer = '';
            hasAnswered = false;
        } else {
            hasAnswered = true;
            answer = answer.text;
        }
        res.status(200).json([{
            riddleId: riddle.riddleId,
            name: riddle.name,
            text: riddle.text,
            difficulty: riddle.difficulty,
            duration: riddle.duration,
            state: riddle.state,
            hint1: riddle.hint1,
            hint2: riddle.hint2,
            solution: riddle.solution,
            authorId: riddle.authorId,
            endDate: riddle.endDate
        }, {
            answer: answer, hasAnswered: hasAnswered

        }]);
    } catch (err) {
        res.status(500).json({error: "Internal Server Error"});
    }
});

//POST new riddle
app.post("/api/new-riddle", isLoggedIn,
    body("name").isString(),
    body("text").isString(),
    body("difficulty").isString(),
    body("duration").isInt({min: 30, max: 600}),
    body("hint1").isString(),
    body("hint2").isString(),
    body("solution").isString(),
    async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(422).json({error: "Riddle Info is not valid"});
    }
    try {
        await riddleDao.createRiddle(req.body.name, req.body.text, req.body.difficulty, req.body.duration, req.body.hint1, req.body.hint2, req.body.solution, req.user.userId);
        return res.status(201).json({msg : "Created Successfully"});
    } catch (err) {
        res.status(503).json({error: "Error Creating riddle in the database!"});
    }
});

//POST to close riddle after correct answer or timeout
app.post("/api/:riddleId/close", param("riddleId").isInt({min: 1}),
    async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(422).json({error: "Riddle Id is not Valid"});
    }
    try {
        await riddleDao.closeRiddle(req.params.riddleId);
        return res.status(200).json({msg : "Riddle Closed"});
    } catch (err) {
        res.status(503).json({error: "Error closing riddle"});
    }
});

/*** Answers API  ***/
//POST answer from logged in user
app.post("/api/riddles/:riddleId",
    param("riddleId").isInt({min: 1}),
    body("text").isString(),
    async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(422).json({error: "Request data is not valid"});
    }
    try {
        //Check if it's the first answer to register the endDate and start countdown
        const firstAnswer = await answerDao.getAnswersForRiddle(req.params.riddleId);
        if (firstAnswer.length === 0) {
            const riddle = await riddleDao.getRiddleById(req.params.riddleId);
            const duration = riddle.duration;
            await riddleDao.setEndDate(req.params.riddleId, dayjs().add(duration, 'second'));
        }
        //get riddle data to check answer and score if it's correct
        const X = await riddleDao.getRiddleAnswerAndScore(req.params.riddleId);
        let score = 0;
        let correct = false;

        if (X.SOL === req.body.text) {
            score = X.SC;
            correct = true;
            await riddleDao.closeRiddle(req.params.riddleId);
            await userDao.addToScore(req.user.userId, score);
        }
        const result = await answerDao.createAnswer(req.params.riddleId, req.user.userId, req.body.text, score, correct);
        return res.status(201).json(result);
    } catch (err) {
        res.status(503).json({error: "Error Creating Answer in the database!"});
    }
});


//GET answers for specific Riddle
app.get('/api/riddles/:riddleId/answers', isLoggedIn,
    param("riddleId").isInt({min: 1}),
    async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(422).json({error: "Riddle Id is not Valid"});
    }
    try {
        const answers = await answerDao.getAnswersForRiddle(req.params.riddleId);
        res.status(200).json(answers.map((ans) => {
            return {
                answerId: ans.answerId, name: ans.name, text: ans.text, correct: ans.correct
            }
        }));
    } catch (err) {
        res.status(500).json({error: "Internal Server Error"});
    }
});



/*** Ranking API ***/
//GET Top 3 users depending on score , in case of equality all users in range of top 3 are returned
app.get('/api/ranking', async (req, res) => {
    try {
        const users = await userDao.getTop3();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({error: "Internal Server Error"});
    }
});


// Activating the server
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));
