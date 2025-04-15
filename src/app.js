const express = require('express');
const apiRouter = require('./routes/api-router');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

const { missingRouteHandler } = require('./errors/index.js');

app.use('/api', apiRouter);

//app.use(psqlErrorHandler);
//app.use(customErrorHandler);
//app.use(serverErrorHandler);
app.use("/api/:wildcard", missingRouteHandler);

module.exports = app;
