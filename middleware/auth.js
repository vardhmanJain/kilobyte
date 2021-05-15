const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function auth(req, res, next, authority) {
  try {
    const token = req.cookies.token;
    if (!token) throw "unauthorised";
    //validate the token or make sure our server has created the token
    const verified = jwt.verify(token, process.env.JWT_SECRET); //throws an err if not verified else returns an object
    if (!authority.includes(verified.user.userType)) throw "unauthorised";

    req.user = verified.user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      status: false,
      errors: [{ message: "unauthorised" }],
    });
  }
}
module.exports = auth;
