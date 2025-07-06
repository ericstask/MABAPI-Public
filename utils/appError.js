// Extends the Error class by adding some more properties to it
class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
  
      this.statusCode = statusCode;
      // if the status code starts with 4 it's a fail, if it starts with 5 it's an error
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperationalError = true; // the error was generated predictably in the code
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;
  