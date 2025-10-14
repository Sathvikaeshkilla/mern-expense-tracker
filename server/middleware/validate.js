const { validationResult } = require('express-validator');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const formatted = errors.array().map(err => ({ field: err.path, message: err.msg }));
  return res.status(422).json({ message: 'Validation failed', errors: formatted });
}

module.exports = validate;


