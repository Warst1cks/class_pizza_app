const express = require("express");

const orderModel = require("../models/orderModel");
const { authenticateUser, authorizeAdmin } = require("../authentication");

const orderRouter = express.Router();

orderRouter.use(authenticateUser);

orderRouter.post("/", async (req, res) => {
  try {
    const orderToBeCreated = req.body;
    const total_price = orderToBeCreated.items?.reduce((prev, currItem) => {
      prev += currItem.price * currItem.quantity;
      return prev;
    }, 0);

    const order = await orderModel.create({
      total_price: total_price,
      items: orderToBeCreated.items,
    });
    return res.status(201).json({
      status: "success",
      order: order,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: error,
    });
  }
});

orderRouter.use(authorizeAdmin);

orderRouter.get("/", async (req, res) => {
  try {
    const query = req.query;
    let ordersQuery;
    if (query.state) {
      ordersQuery = orderModel.find({ state: query.state });
    } else {
      ordersQuery = orderModel.find({});
    }

    if (query.sort) {
      ordersQuery.sort(query.sort);
    }
    const page = +query.page || 1;
    const limit = 3;
    const skip = (page - 1) * limit;

    ordersQuery.skip(skip).limit(limit);

    const orders = await ordersQuery;
    return res.status(200).json({
      status: "success",
      results: orders.length,
      orders: orders,
    });
  } catch (error) {
    return res.status(404).json({
      status: "failed",
      message: error,
    });
  }
});

orderRouter.get("/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderModel.findById(orderId);
    return res.status(200).json({
      status: "success",
      order: order,
    });
  } catch (error) {
    return res.status(404).json({
      status: "failed",
      message: error,
    });
  }
});

orderRouter.patch("/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { state } = req.body;

    const order = await orderModel.findById(orderId);

    if (!state) {
      return res.status(400).json({
        success: false,
        message: "Bad request! Only the state can be modified!",
      });
    }

    if (state < order.state) {
      return res.status(422).json({
        success: false,
        message: "Invalid operation!",
      });
    }

    order.state = state;

    await order.save();
    return res.status(200).json({
      status: "success",
      order: order,
    });
  } catch (error) {
    return res.status(404).json({
      status: "failed",
      message: error,
    });
  }
});

orderRouter.delete("/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderModel.findByIdAndDelete(orderId);
    return res.status(200).json({
      status: "success",
      order: order,
    });
  } catch (error) {
    return res.status(404).json({
      status: "failed",
      message: error,
    });
  }
});

module.exports = orderRouter;
