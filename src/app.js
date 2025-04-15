const express = require('express');
const apiRouter = require('./routes/api-router');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

//const {psqlErrorHandler, customErrorHandler, serverErrorHandler, inputErrorHandler} = require('./errors/index.js');

app.use('/api', apiRouter);
//app.use('/api/*', inputErrorHandler);
//app.use(psqlErrorHandler);
//app.use(customErrorHandler);
//app.use(serverErrorHandler);

module.exports = app;
