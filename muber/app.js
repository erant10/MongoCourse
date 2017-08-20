const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const app = express();

//connect the app to the mongo instanse
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/muber');

app.use(bodyParser.json());
routes(app);


module.exports = app;