const router = require("express").Router();
const requireLogin = require("../middlewares/requireLogin");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const hasProduct = async (productId) => {
  try {
    const product = await Product.findById(productId);
    return Boolean(product);
  } catch (error) {
    return false;
  }
};

const checkItems = async (items) => {
  let newItems = [];
  for (item of items) {
    if (Number(item.amount) !== 0 && (await hasProduct(item.productId))) {
      newItems.push(item);
    }
  }
  return newItems;
};

const getCartItemsWithProduct = async (items) => {
  let newItems = [];
  for (let item of items) {
    newItems.push({
      product: await Product.findById(item.productId),
      amount: item.amount,
    });
  }
  return newItems;
};

router.get("/cart", requireLogin, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) cart = await Cart.create({ userId: req.user.id, items: [] });
    cart.items = await checkItems(cart.items);
    await cart.save();

    let cartItemsWithProduct = await getCartItemsWithProduct(cart.items);
    res.status(200).send(cartItemsWithProduct);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/cart", requireLogin, async (req, res) => {
  try {
    const items = await checkItems(req.body);
    let cart = { userId: req.user.id, items: items };

    // get cart
    await Cart.findOneAndUpdate({ userId: req.user.id }, cart, {
      upsert: true,
      useFindAndModify: false,
    });
    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
