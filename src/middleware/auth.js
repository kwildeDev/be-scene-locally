const jwt = require("jsonwebtoken");

exports.verifyToken = (request, response, next) => {
    const authorisationHeader = request.headers.authorization;
    const format = request.headers.authorization?.split(" ")[0];
    const token = request.headers.authorization?.split(" ")[1]; 
    if (!authorisationHeader) {
        return response.status(401).send({ msg: 'Unauthorised - No Token Provided' });
    } 
    if (!format || format.toLowerCase() !== 'bearer') {
        return response.status(401).send({ msg: 'Unauthorised - Invalid Token Format' });
    }
    if (!token) {
        return response.status(401).send({ msg: 'Unauthorised - No Token Provided' });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        request.user = decodedToken;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return response.status(401).send({ msg: 'Token Expired' });
        } else {
            return response.status(401).send({ msg: 'Unauthorised - Invalid Token' })
        }
    }
};