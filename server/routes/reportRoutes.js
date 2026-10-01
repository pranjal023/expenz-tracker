const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");
const premiumMiddleware = require("../middleware/premiumMiddleware");

router.use(authMiddleware);
router.use(premiumMiddleware); 

router.get("/download", async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId }).sort({ createdAt: -1 });

    const doc = new PDFDocument({ margin: 40 });

    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=expense-report.pdf");
    doc.pipe(res);

    // Header
    doc.fontSize(20).text("Expense Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text(`Generated: ${new Date().toLocaleDateString()}`, { align: "center" });
    doc.moveDown(2);

    // Total
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    doc.fontSize(14).text(`Total Spent: ₹${total}`, { align: "left" });
    doc.moveDown();

    // Table header
    doc.fontSize(12).text("Title", 50, doc.y, { continued: true, width: 200 });
    doc.text("Category", 250, doc.y, { continued: true, width: 150 });
    doc.text("Amount", 400, doc.y);
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); // horizontal line
    doc.moveDown(0.5);

    // Table rows
    expenses.forEach((expense) => {
      doc.fontSize(10).text(expense.title, 50, doc.y, { continued: true, width: 200 });
      doc.text(expense.category, 250, doc.y, { continued: true, width: 150 });
      doc.text(`₹${expense.amount}`, 400, doc.y);
    });

    doc.end(); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;