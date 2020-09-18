const router = require("express").Router();
const createPayment = require("../services/createPayment");
const requireLogin = require("../middlewares/requireLogin");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Transaction = require("../models/Transaction");

router.get("/payment", async (req, res) => {
  const intent = await createPayment(500, "usd");
  res.json({ client_secret: intent.client_secret, totalPrice: 500 });
});

const chekTransaction = async (req, res, next) => {
  try {
    let { orders, address } = req.body;
    let totalPrice = 0;
    for (let order of orders) {
      let { amount, product } = order;
      let foundProduct = await Product.findById(product.productId);
      if (!foundProduct) res.status(404).send({ msg: "product not found" });
      if (product.price !== foundProduct.price)
        res.status(400).send({ msg: "illegal product price" });
      if (amount > foundProduct.amount)
        res.status(400).send({ msg: "product insufficient" });
      totalPrice += amount * product.price;
    }

    let transaction = {
      orders: orders,
      address: address,
      totalPrice: totalPrice,
    };
    req.transaction = transaction;
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};

router.post("/payment", chekTransaction, async (req, res) => {
  try {
    const transaction = req.transaction;
    // split transactions to orders and add to database
    let createdOrders = [];
    for (let order of transaction.orders) {
      let product = await Product.findById(order.product.productId);
      let createdOrder = await Order.create({
        buyer: req.user,
        owner: product.owner,
        address: transaction.address,
        product: order.product,
        amount: order.amount,
        status: "noPaid",
      });
      createdOrders.push(createdOrder);
    }
    // add transactions to database
    let createdTransaction = await Transaction.create({
      buyer: req.user,
      orders: createdOrders,
    });
    const intent = await createPayment(
      transaction.totalPrice,
      "usd",
      createdTransaction.id
    );
    res.status(200).json({
      client_secret: intent.client_secret,
      totalPrice: transaction.totalPrice,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bodyParser = require("body-parser");
const { get } = require("mongoose");

router.post("/webhook", async (req, res) => {
  try {
    let event = req.body;

    // Handle the event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      let transactionId = paymentIntent.metadata.transactionId;
      let transaction = await Transaction.findById(transactionId)
        .populate("orders")
        .exec();
      console.log(transaction);
      for (let order of transaction.orders) {
        order.status = "paid";
        await order.save();
        let product = await Product.findById(order.product.productId);
        if (product) {
          product.quantity -= order.amount;
          await product.save();
        }
      }
    }
    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
