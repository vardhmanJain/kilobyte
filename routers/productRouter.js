const Product = require("../models/Product");
const router = require("express").Router();
const auth = require("../middleware/auth");
//create a product
router.post(
  "/",
  (req, res, next) => auth(req, res, next, ["admin"]),
  async (req, res) => {
    try {
      const { name, category, locations } = req.body;
      const newProduct = new Product({ name, category, locations });
      const savedProduct = await newProduct.save();
      res.json({ status: true });
    } catch (err) {
      // console.log(err);
      res.status(500).json({
        status: false,
        errors: [{ message: "something went wrong" }],
      });
    }
  }
);
//get all products
router.get(
  "/",
  (req, res, next) => auth(req, res, next, ["admin", "customer"]),
  async (req, res) => {
    try {
      const products = await Product.find();
      res.json({
        status: true,
        content: {
          data: products,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: false,
        errors: [{ message: "something went wrong" }],
      });
    }
  }
);

module.exports = router;
