const express = require("express");
const Expense = require("../models/Expense");
const protect = require("../middleware/authMiddleware");

const {
  validateCreateExpense,
  validateUpdateExpense,
  validateGetExpenses,
  validateDeleteExpense,
} = require("../middleware/validationMiddleware");

const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate');


const router = express.Router();

// @route   GET /api/expenses
// @desc    Get all expenses of the logged-in user

router.get("/", protect, validateGetExpenses, async (req, res, next) => {

router.get(
  "/",
  protect,
  [
    query('category').optional().isString().trim().isLength({ max: 100 }),
    query('from').optional().isISO8601().toDate(),
    query('to').optional().isISO8601().toDate(),
    query('sortBy').optional().isIn(['date', 'amount', 'title', 'category']),
    query('order').optional().isIn(['asc', 'desc']),
  ],
  validate,
  async (req, res) => {

  try {
    const { category, from, to, sortBy = "date", order = "desc" } = req.query;

    const query = { user: req.user._id };

    // Category filter
    if (category) {
      query.category = { $regex: new RegExp(category, "i") }; // case-insensitive
    }

    // Date range filter
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    const sortOrder = order === "asc" ? 1 : -1;

    const expenses = await Expense.find(query).sort({ [sortBy]: sortOrder });

    res.json(expenses);
  } catch (err) {
    err.message = "Error fetching expenses: " + err.message;
    next(err);
  }
});

// @route   POST /api/expenses
// @desc    Add a new expense for the logged-in user

router.post("/", protect, validateCreateExpense, async (req, res, next) => {

router.post(
  "/",
  protect,
  [
    body('title').isString().trim().isLength({ min: 1, max: 200 }),
    body('amount').isFloat({ gt: 0 }).toFloat(),
    body('category').isString().trim().isLength({ min: 1, max: 100 }),
    body('date').optional().isISO8601().toDate(),
  ],
  validate,
  async (req, res) => {

  try {
    const { title, amount, category, date } = req.body;

    const newExpense = new Expense({
      user: req.user._id,
      title,
      amount,
      category,
      date,
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    err.message = "Error adding expense: " + err.message;
    next(err);
  }
});

// ✅ NEW: Update route for editing expenses
// @route   PUT /api/expenses/:id
// @desc    Update an existing expense

router.put("/:id", protect, validateUpdateExpense, async (req, res, next) => {

router.put(
  "/:id",
  protect,
  [
    param('id').isMongoId(),
    body('title').optional().isString().trim().isLength({ min: 1, max: 200 }),
    body('amount').optional().isFloat({ gt: 0 }).toFloat(),
    body('category').optional().isString().trim().isLength({ min: 1, max: 100 }),
    body('date').optional().isISO8601().toDate(),
  ],
  validate,
  async (req, res) => {

  try {
    const { title, amount, category, date } = req.body;

    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      const error = new Error("Expense not found");
      error.statusCode = 404;
      return next(error);
    }

    expense.title = title;
    expense.amount = amount;
    expense.category = category;
    expense.date = date;

    const updated = await expense.save();
    res.json(updated);
  } catch (err) {
    err.message = "Update failed: " + err.message;
    next(err);
  }
});
// @route   DELETE /api/expenses/:id

router.delete("/:id", protect, validateDeleteExpense, async (req, res, next) => {

router.delete(
  "/:id",
  protect,
  [param('id').isMongoId()],
  validate,
  async (req, res) => {

  try {
    const deletedExpense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id, // ensure user can only delete their own expense
    });

    if (!deletedExpense) {
      const error = new Error("Expense not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json({ message: "Expense deleted successfully", expense: deletedExpense });
  } catch (err) {
    console.error("Delete error:", err);
    err.message = "Delete failed: " + err.message;
    next(err);
  }
});
module.exports = router;
