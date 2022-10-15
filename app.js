const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const userRouter = require("../class_pizza_app/routes/userRoutes");
const orderRouter = require("../class_pizza_app/routes/orderRoutes");
require("dotenv").config();
require("../class_pizza_app/authentication/auth");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/users", passport.authenticate("jwt", { session: false }), userRouter);
app.use(
  "/orders",
  passport.authenticate("jwt", { session: false }),
  orderRouter
);

module.exports = app;
