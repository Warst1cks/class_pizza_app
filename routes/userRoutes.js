const express = require("express");
const passport = require("passport");

const userModel = require("../models/userModel");
// const { authenticateUser, authorizeAdmin } = ("../authentication");

const authRouter = express.Router();

authRouter.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    res.json({
      message: "Signup successful",
      user: req.user,
    });
  }
);

authRouter.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }
      if (!user) {
        const error = new Error("Username or password is incorrect");
        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id, username: user.username };
        //You store the id and email in the payload of the JWT.
        // You then sign the token with a secret or key (JWT_SECRET), and send back the token to the user.
        // DO NOT STORE PASSWORDS IN THE JWT!
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET);

        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

module.exports = authRouter;







// TODO: C R U D operations on /users route

// CREATE

// ADD A NEW USER

// userRouter.post("/", async (req, res) => {
//   try {
//     const userToBeCreated = req.body;
//     const user = await userModel.create(userToBeCreated);
//     return res.status(201).json({
//       status: "success",
//       user: user,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: "failed",
//       message: error,
//     });
//   }
// });

// userRouter.use(authenticateUser);

// // UPDATE
// userRouter.patch("/:userId", async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const update = req.body;
//     const user = await userModel.findByIdAndUpdate(userId, update, {
//       runValidators: true,
//       new: true,
//     });
//     return res.status(200).json({
//       status: "success",
//       user: user,
//     });
//   } catch (error) {
//     return res.status(404).json({
//       status: "failed",
//       message: error,
//     });
//   }
// });

// // DELETE
// userRouter.delete("/:userId", async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const user = await userModel.findByIdAndDelete(userId);
//     return res.status(200).json({
//       status: "success",
//       user: user,
//     });
//   } catch (error) {
//     return res.status(404).json({
//       status: "failed",
//       message: error,
//     });
//   }
// });

// userRouter.use(authorizeAdmin);

// // READ

// // GETS ALL USERS
// userRouter.get("/", async (req, res) => {
//   try {
//     const users = await userModel.find({});
//     return res.status(200).json({
//       status: "success",
//       users: users,
//     });
//   } catch (error) {
//     return res.status(404).json({
//       status: "failed",
//       message: error,
//     });
//   }
// });

// // GET USER BY ID

// userRouter.get("/:userId", async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const user = await userModel.findById(userId);
//     return res.status(200).json({
//       status: "success",
//       user: user,
//     });
//   } catch (error) {
//     return res.status(404).json({
//       status: "failed",
//       message: error,
//     });
//   }
// });

// module.exports = userRouter;
