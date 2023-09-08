const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "thisismynewcourse");
    //we'll get the user id with the decoded token so we'll use that
    
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    //also check if this token is part of that tokens array
    //so when user logs out we wanna delete that
    if (!user) {
      throw new Error();
    }
    //send this user to the route handles so that it doesnt have to again search for that user which will save time and resource
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
