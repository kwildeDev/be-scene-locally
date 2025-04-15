exports.missingRouteHandler = (request, response) => {
    response.status(404).send({ msg: "Endpoint Does Not Exist" });
};
