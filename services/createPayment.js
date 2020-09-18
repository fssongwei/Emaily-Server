const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createPayment = async (amount, currency, transactionId) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: currency,
    // Verify your integration in this guide by including this parameter
    metadata: {
      integration_check: "accept_a_payment",
      transactionId: transactionId,
    },
  });
  return paymentIntent;
};

module.exports = createPayment;
