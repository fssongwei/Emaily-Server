const router = require("express").Router();
const requireLogin = require("../middlewares/requireLogin");
const Product = require("../models/Product");

const productUpdateCheck = (req, res, next) => {
  let product = req.body;
  if (
    !product.name ||
    !product.intro ||
    !product.price ||
    !product.quantity ||
    !product.pics ||
    !product.category
  ) {
    res.status(400).send({ msg: "Invalid product submit!" });
    return;
  }
  product.owner = req.user; // add product owner
  req.product = product;
  next();
};

const productOwnershipCheck = async (req, res, next) => {
  try {
    let productId = req.params.id;
    let product = await Product.findById(productId).populate("owner").exec();
    if (req.user.id !== product.owner.id)
      req.status(400).send({ msg: "Unauthorized access!" });
    else next();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

router.get("/products", async (req, res) => {
  try {
    let products = {};
    let category = req.query.category;
    if (category && category !== "all")
      products = await Product.find({ category: category });
    else products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) res.status(404).send({ msg: "Product not found" });
    else res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/products", requireLogin, productUpdateCheck, async (req, res) => {
  try {
    let product = await Product.create(req.product);
    res
      .status(200)
      .send({ msg: "Product created successfully!", productId: product.id });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.put(
  "/products/:id",
  requireLogin,
  productOwnershipCheck,
  productUpdateCheck,
  async (req, res) => {
    console.log(req.product);
    console.log(req.params.id);
    try {
      let oldProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.product,
        {
          useFindAndModify: false,
        }
      );
      if (!oldProduct) res.status(404).send({ msg: "Product not found" });
      else res.status(200).send({ msg: "Product updated!" });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
);

router.delete(
  "/products/:id",
  requireLogin,
  productOwnershipCheck,
  async (req, res) => {
    try {
      let removedProduct = await Product.findByIdAndRemove(req.params.id, {
        useFindAndModify: false,
      });
      if (!removedProduct) res.status(404).send({ msg: "Product not found" });
      else res.status(200).send({ msg: "Product removed!" });
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

module.exports = router;
