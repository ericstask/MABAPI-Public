// This function raps the functions in our controller functions for the purpose of generating errors.
// This simplifies the code in the controllers, making it more focused and easier to read.

module.exports = (fn) => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  };
  