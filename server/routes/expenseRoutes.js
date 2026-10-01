const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");


router.use(authMiddleware);

// GET all expenses 
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const category = req.query.category; 
    const filter = { user: req.userId };
    if (category && category !== "All") {
      filter.category = category;
    }

    const totalExpenses = await Expense.countDocuments(filter);
    const totalPages = Math.ceil(totalExpenses / limit);

    const expenses = await Expense.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      expenses,
      currentPage: page,
      totalPages,
      totalExpenses,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new expense 
router.post("/", async (req, res) => {
  try {
    const { title, amount, category } = req.body;
    const newExpense = new Expense({ title, amount, category, user: req.userId });
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE 
router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    if (expense.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete this expense" });
    }
    await expense.deleteOne();
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    if (expense.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to edit this expense" });
    }

    const { title, amount, category } = req.body;
    expense.title = title;
    expense.amount = amount;
    expense.category = category;
    const updated = await expense.save();

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;