const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// Auth validations
const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .trim()
    .escape(),
  handleValidationErrors,
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .trim()
    .escape(),
  handleValidationErrors,
];

// Expense validations
const validateCreateExpense = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters')
    .trim()
    .escape(),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters')
    .trim()
    .escape(),
  body('date')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date')
    .toDate(),
  handleValidationErrors,
];

const validateUpdateExpense = [
  param('id')
    .isMongoId()
    .withMessage('Invalid expense ID'),
  body('title')
    .optional()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters')
    .trim()
    .escape(),
  body('amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('category')
    .optional()
    .notEmpty()
    .withMessage('Category cannot be empty')
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters')
    .trim()
    .escape(),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date')
    .toDate(),
  handleValidationErrors,
];

const validateGetExpenses = [
  query('category')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters')
    .trim()
    .escape(),
  query('from')
    .optional()
    .isISO8601()
    .withMessage('From date must be a valid ISO 8601 date'),
  query('to')
    .optional()
    .isISO8601()
    .withMessage('To date must be a valid ISO 8601 date'),
  query('sortBy')
    .optional()
    .isIn(['date', 'amount', 'title', 'category'])
    .withMessage('SortBy must be one of: date, amount, title, category'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc'),
  handleValidationErrors,
];

const validateDeleteExpense = [
  param('id')
    .isMongoId()
    .withMessage('Invalid expense ID'),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateCreateExpense,
  validateUpdateExpense,
  validateGetExpenses,
  validateDeleteExpense,
};
