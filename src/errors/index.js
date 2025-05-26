exports.psqlErrorHandler = (err, request, response, next) => {
    const errorLookup = {
        "23502": { status: 400, msg: "Bad Request" },
        "22P02": { status: 400, msg: "Bad Request" },
        "23503": { status: 404, msg: "Not Found" }
    };
    if (err.code === "23503" && err.detail) {
        const errorMatch = err.detail.match(/Key \(([^)]+)\)=\(([^)]+)\) is not present in table "([^"]+)"/);
        if (errorMatch) {
            const [, column, value ] = errorMatch;
            return response.status(404).send({ msg: `${column.replace("_", " ").toUpperCase()} ${value} Does Not Exist`});
        }
    } 
    const errorResponse = errorLookup[err.code];
    if (errorResponse) {
        return response.status(errorResponse.status).send({ msg: errorResponse.msg });
    }
    next(err);
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