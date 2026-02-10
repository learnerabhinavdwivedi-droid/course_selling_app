const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    provider: { type: String, enum: ['stripe', 'razorpay'], default: 'stripe' },
    providerPaymentId: String,
    amount: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    status: { type: String, enum: ['pending', 'paid', 'refunded', 'failed'], default: 'pending' },
    couponCode: String,
    discountPercent: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
