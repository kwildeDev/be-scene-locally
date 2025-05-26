const express = require('express');
const apiRouter = require('./routes/api-router');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

const { psqlErrorHandler, customErrorHandler, serverErrorHandler } = require('./errors/index.js');

app.use('/api', apiRouter);

app.use((request, response, next) => {
    if (!response.headersSent) {
        response.status(404).send({ msg: "Endpoint Does Not Exist" });
    } else {
        next();
    }
});

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
