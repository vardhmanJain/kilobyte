const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    const { mobile, password, userType } = req.body;
    const existingUser = await User.findOne({ mobile });
    if (existingUser)
      return res.status(400).json({
        errorMessage: "An account with this mobile already exists",
      });
    //hash the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    //save the new user account to the db
    const newUser = new User({ mobile, passwordHash, userType });
    const savedUser = await newUser.save();
    const token = jwt.sign(
      {
        user: {
          userType,
          id: savedUser._id,
        },
      },
      process.env.JWT_SECRET
    );
    console.log(token);
    //send the token in a HTTP-only cookie so it is not read by js
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .json({ status: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      errors: [{ message: "something went wrong" }],
    });
  }
});
//signin user
router.post("/signin", async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const existingUser = await User.findOne({ mobile });
    if (!existingUser)
      return res
        .status(401)
        .json({ errorMessage: "wrong mobile or the account doesent exist" });
    //compare the entered password with the password associated with the email
    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );
    if (!passwordCorrect)
      return res.status(401).json({ errorMessage: "wrong password" });
    //define payload sent in token and with the res object too
    const user = {
      id: existingUser._id,
      userType: existingUser.userType,
    };
    const token = jwt.sign({ user }, process.env.JWT_SECRET);
    //send the token in a HTTP-only cookie so it is not read by js
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .json({ status: true, data: user, token });
  } catch (err) {
    // console.log(err);
    res.status(500).json({
      status: false,
      errors: [{ message: "something went wrong" }],
    });
  }
});
//get users by userType
router.get(
  "/",
  (req, res, next) => auth(req, res, next, ["admin"]),
  async (req, res) => {
    try {
      const userType = req.query.userType;
      // console.log(userType);
      const users = await User.find({ userType }, "-passwordHash");
      res.json({
        status: true,
        content: {
          data: users,
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
