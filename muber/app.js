const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const app = express();

//connect the app to the mongo instanse
mongoose.Promise = global.Promise;
if(process.env.NODE_ENV !== 'test') {
    // connect to the app DB if we are not in the test envrinment
    mongoose.connect('mongodb://localhost/muber');
}

// Register the json body parser to parse the incoming requests
app.use(bodyParser.json());

routes(app);

// define a middleware function to use for error handling
/**
 * Middleware function
 * @param {Object} err - an error object that is sent if a request has failed
 * @param {Object} req - an incoming request
 * @param {Object} res - an outgoing response
 * @param {function} next - a function that passes control flow to the next middleware in the chain
 */
function middleware(err, req, res, next) {
    // when there is error, send the following response with the status 422 - 'Unprocessable Entity'
    res.status(422).send({ error: err.message });
}
app.use(middleware);

module.exports = app;