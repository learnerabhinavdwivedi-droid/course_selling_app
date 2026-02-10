const Stripe = require('stripe');
const { STRIPE_KEY } = require('../config/env');

const stripe = STRIPE_KEY ? new Stripe(STRIPE_KEY) : null;

async function createPaymentIntent({ amount, currency = 'usd', metadata = {} }) {
  if (!stripe) {
    return {
      id: `mock_intent_${Date.now()}`,
      client_secret: 'mock_client_secret',
      amount,
      currency
    };
  }

  return stripe.paymentIntents.create({
    amount,
    currency,
    metadata
  });
}

async function createRefund(paymentIntentId) {
  if (!stripe) {
    return { id: `mock_refund_${Date.now()}`, payment_intent: paymentIntentId, status: 'succeeded' };
  }
  return stripe.refunds.create({ payment_intent: paymentIntentId });
}

module.exports = { createPaymentIntent, createRefund };
