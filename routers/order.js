const router = require("express").Router();
const requireLogin = require("../middlewares/requireLogin");
const Order = require("../models/Order");

router.get("/sell", requireLogin, async (req, res) => {
  try {
    let orders = await Order.find({
      owner: req.user.id,
      status: { $ne: "noPaid" },
    });
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/buy", requireLogin, async (req, res) => {
  try {
    let orders = await Order.find({
      buyer: req.user.id,
      status: { $ne: "noPaid" },
    });
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/comfirmShipment", requireLogin, async (req, res) => {
  try {
    let { orderId, trackCode, shipmentProvider } = req.body;
    let order = await Order.findById(orderId).populate("owner").exec();
    if (!order || order.owner.id !== req.user.id) {
      res.status(400).send({ msg: "Unauthorized access!" });
      return;
    }
    if (trackCode) order.trackCode = trackCode;
    if (shipmentProvider) order.shipmentProvider = shipmentProvider;
    order.status = "shipped";
    await order.save();
    res.status(200).send({ msg: "success!" });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/comfirmReceived", requireLogin, async (req, res) => {
  try {
    let { orderId } = req.body;
    let order = await Order.findById(orderId).populate("buyer").exec();
    if (!order || order.buyer.id !== req.user.id) {
      res.status(400).send({ msg: "Unauthorized access!" });
      return;
    }
    order.status = "completed";
    await order.save();
    res.status(200).send({ msg: "success!" });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
