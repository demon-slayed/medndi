import mongoose from "mongoose";
import Payment from "../models/payment.js";
import { v4 as uuidv4 } from "uuid";

// Get All Payments (Admin)
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("application_id");
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Payments by Application
export const getPaymentsByApplication = async (req, res) => {
  try {
    const { application_id } = req.params;

    // Validate application_id
    if (!mongoose.Types.ObjectId.isValid(application_id)) {
      return res.status(400).json({ error: "Invalid application_id format" });
    }

    const payments = await Payment.find({ application_id }).populate("application_id");

    if (payments.length === 0) {
      return res.status(404).json({ error: "No payments found for this application" });
    }

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const { payment_id } = req.params;
    const payment = await Payment.findOne({ payment_id }).populate("application_id");

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create Payment
export const createPayment = async (req, res) => {
  try {
    const { application_id, amount, payment_gateway, payment_id } = req.body;

    // Validate required fields
    if (!application_id || !amount || !payment_gateway) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Ensure application_id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(application_id)) {
      return res.status(400).json({ error: "Invalid application_id format" });
    }

    const newPayment = new Payment({
      payment_id,
      application_id,
      amount,
      payment_gateway,
      payment_status: "Pending",
      payment_details: {
        payment_id: null,
        transaction_id: null,
      },
    });

    await newPayment.save();
    res.status(201).json({ message: "Payment created successfully", payment: newPayment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Payment Status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { payment_id } = req.params;
    const { payment_status, payment_details } = req.body;

    // Validate status before updating
    const validStatuses = ["Pending", "Completed", "Failed"];
    if (!validStatuses.includes(payment_status)) {
      return res.status(400).json({ error: "Invalid payment_status value" });
    }

    const payment = await Payment.findOneAndUpdate(
      { payment_id },
      { payment_status, payment_details },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.status(200).json({ message: "Payment status updated successfully", payment });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Generate Payment Receipt (Dummy Response)
export const generateReceipt = async (req, res) => {
  console.log("hii");
  
  try {
    const { payment_id } = req.params;
    const payment = await Payment.findOne({ payment_id });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Simulating receipt generation (Replace with actual PDF/file generation logic)
    const receiptData = {
      receipt_id: `REC-${payment.payment_id}`,
      payment_id: payment.payment_id,
      application_id: payment.application_id,
      amount_paid: payment.amount,
      payment_status: payment.payment_status,
      payment_date: payment.payment_date,
      payment_gateway: payment.payment_gateway,
      download_url: `/receipts/${payment.payment_id}.pdf`, // Replace with actual file URL
    };

    res.status(200).json({ message: "Receipt generated successfully", receipt: receiptData });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
