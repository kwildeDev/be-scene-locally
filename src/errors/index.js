exports.psqlErrorHandler = (err, request, response, next) => {
    if (err.code === "23502" || err.code === "22P02" || err.code === "23503") {
        response.status(400).send({ msg: "Bad Request" });
      } else next(err);
    next(err)
};

exports.customErrorHandler = (err, request, response, next) => {
    if (err.status && err.msg) {
        response.status(err.status).send({msg: err.msg})
    }
};

exports.serverErrorHandler = (err, request, response, next) => {
    response.status(500).send({msg: "Internal Server Error"})
};

exports.missingRouteHandler = (request, response) => {
    response.status(404).send({ msg: "Endpoint Does Not Exist" });
};
