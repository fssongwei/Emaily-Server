const router = require("express").Router();
const createPayment = require("../services/createPayment");
const requireLogin = require("../middlewares/requireLogin");
const User = require("../models/User");

router.get("/payment", async (req, res) => {
  const intent = await createPayment(500, "usd");
  res.json({ client_secret: intent.client_secret });
});

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bodyParser = require("body-parser");

router.post("/webhook", async (req, res) => {
  let event = req.body;

  // Handle the event
  console.log(event.type);
  if (event.type === "payment_intent.succeeded") {
    let userId = event.data.object.charges.data[0].billing_details.name;
    let amount = event.data.object.charges.data[0].amount;

    let user = await User.findById(userId);
    user.balance += amount;
    await user.save();
    console.log(user);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
});

module.exports = router;
