const Course = require('../models/course.model');
const Payment = require('../models/payment.model');
const { createPaymentIntent, createRefund } = require('../services/payment.service');

function applyCoupon(price, coupon) {
  const coupons = {
    SAVE10: 10,
    SAVE20: 20
  };
  const discountPercent = coupons[coupon] || 0;
  return {
    discountPercent,
    discountedAmount: Math.max(0, Math.round(price * (1 - discountPercent / 100) * 100))
  };
}

exports.createCoursePayment = async (req, res) => {
  const { couponCode } = req.body;
  const course = await Course.findById(req.params.courseId);
  if (!course) return res.status(404).json({ error: 'Course not found' });

  const { discountPercent, discountedAmount } = applyCoupon(course.price, couponCode);
  const intent = await createPaymentIntent({
    amount: discountedAmount,
    metadata: { userId: req.user.id, courseId: req.params.courseId }
  });

  const payment = await Payment.create({
    user: req.user.id,
    course: req.params.courseId,
    provider: 'stripe',
    providerPaymentId: intent.id,
    amount: discountedAmount,
    status: 'pending',
    couponCode,
    discountPercent
  });

  return res.status(201).json({ paymentId: payment._id, clientSecret: intent.client_secret, amount: discountedAmount });
};

exports.confirmPayment = async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(req.params.paymentId, { status: 'paid' }, { new: true });
  if (!payment) return res.status(404).json({ error: 'Payment not found' });
  return res.json({ message: 'Payment confirmed', payment });
};

exports.refundPayment = async (req, res) => {
  const payment = await Payment.findById(req.params.paymentId);
  if (!payment) return res.status(404).json({ error: 'Payment not found' });

  await createRefund(payment.providerPaymentId);
  payment.status = 'refunded';
  await payment.save();

  return res.json({ message: 'Refund processed', payment });
};
