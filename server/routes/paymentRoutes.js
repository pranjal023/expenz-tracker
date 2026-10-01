const express = require("express");
const router = express.Router();
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

router.use(authMiddleware);

// Create a payment order
router.post("/create-order", async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const orderId = `order_${Date.now()}_${user._id}`;

    const response = await axios.post(
      process.env.CASHFREE_API_URL,
      {
        order_id: orderId,
        order_amount: 199,
        order_currency: "INR",
        customer_details: {
          customer_id: user._id.toString(),
          customer_email: user.email,
          customer_phone: "9999999999",
        },
        order_meta: {
          return_url: `${process.env.CLIENT_URL}/payment-status?order_id={order_id}`,
        },
      },
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01",
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      paymentSessionId: response.data.payment_session_id,
      orderId,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Failed to create payment order" });
  }
});

// Verify payment status and upgrade user if successful
router.get("/verify/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const response = await axios.get(
      `${process.env.CASHFREE_API_URL}/${orderId}`,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01",
        },
      }
    );

    const status = response.data.order_status;

    if (status === "PAID") {
      await User.findByIdAndUpdate(req.userId, { isPremium: true });
      return res.json({ success: true, status });
    }

    res.json({ success: false, status });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Failed to verify payment" });
  }
});

module.exports = router;