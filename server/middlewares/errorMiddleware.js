const { StatusCodes } = require("http-status-codes");
const constants = require("../utils/constants.js");

const errorMiddleWare = (err, req, res, next) => {
    err.message = err.message || constants.SERVER_ERROR;
    err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    if (err.statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {

    }

    res.status(err.statusCode).json({
        status: false,
        message: err.message,
    });
};

module.exports = errorMiddleWare;
