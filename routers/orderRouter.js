const Product = require("../models/Product");
const Order = require("../models/Order");
const router = require("express").Router();
const auth = require("../middleware/auth");
//create a order
router.post(
  "/",
  (req, res, next) => auth(req, res, next, ["admin", "customer"]),
  async (req, res) => {
    try {
      let { items } = req.body;
      let locations = [];
      for (var i = 0; i < items.length; i++) {
        const item = items[i];
        const product = await Product.findById(item.id);
        const location =
          product.locations[
            Math.floor(Math.random() * product.locations.length)
          ];
        locations.push(location);
      }

      const newOrder = new Order({ items, customerId: req.user.id, locations });
      await newOrder.save();
      res.json({ status: true });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: false,
        errors: [{ message: "something went wrong" }],
      });
    }
  }
);
//get orders
router.get(
  "/",
  (req, res, next) => auth(req, res, next, ["admin"]),
  async (req, res) => {
    try {
      const status = req.query.status;
      const orders = await Order.find({ status });
      res.json({
        status: true,
        content: {
          data: orders,
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
//edit order by admin
router.patch(
  "/:id",
  (req, res, next) => auth(req, res, next, ["admin"]),
  async (req, res) => {
    try {
      const id = req.params.id;
      await Order.findByIdAndUpdate(id, { ...req.body });
      res.json({ status: true });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: false,
        errors: [{ message: "something went wrong" }],
      });
    }
  }
);
//edit order status by driver
router.put(
  "/:id",
  (req, res, next) => auth(req, res, next, ["delivery", "admin"]),
  async (req, res) => {
    try {
      const status = req.body.status;
      const order = await Order.findById(req.params.id);
      //prettier-ignore
      if(req.user.userType == 'delivery' && req.user.id != order.deliveryPersonId) {
        return res
          .status(401)
          .json({ status: false, errors: [{ message: "unauthorised" }] });
      }
      order.status = status ? status : order.status; //if status not sent with headers then status must not change
      await order.save();
      res.json({ status: true });
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
