const express = require("express");
const Expense = require("../models/Expense");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// @route   GET /api/expenses
// @desc    Get all expenses of the logged-in user
router.get("/", protect, async (req, res) => {
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
    res.status(500).json({
      message: "Error fetching expenses",
      error: err.message,
    });
  }
});

// @route   POST /api/expenses
// @desc    Add a new expense for the logged-in user
router.post("/", protect, async (req, res) => {
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
    res
      .status(500)
      .json({ message: "Error adding expense", error: err.message });
  }
});

// ✅ NEW: Update route for editing expenses
// @route   PUT /api/expenses/:id
// @desc    Update an existing expense
router.put("/:id", protect, async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) return res.status(404).json({ message: "Expense not found" });

    expense.title = title;
    expense.amount = amount;
    expense.category = category;
    expense.date = date;

    const updated = await expense.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});
// @route   DELETE /api/expenses/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const deletedExpense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id, // ensure user can only delete their own expense
    });

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully", expense: deletedExpense });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});
module.exports = router;
