const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const constants = require("../utils/constants");
const environmentVariables = require("../utils/environmentVariables");
const ErrorHandler = require("../utils/errorHandler");

const authenticate = (req, res, next) => {
    try {
        const token = req.headers.token;
        const decode = jwt.verify(token, environmentVariables.JWT_SECRET_KEY);

        req.user = decode.data;
        next();

    } catch (error) {
        return next(new ErrorHandler(constants.INVALID_TOKEN, StatusCodes.UNAUTHORIZED, 'authenticateMiddleware'));
    }
};

module.exports = authenticate;
