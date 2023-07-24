class ErrorHandler extends Error {
    constructor(message, statusCode, command) {
        super(message)
        this.statusCode = statusCode
        this.command = command
    }
}

module.exports = ErrorHandler;