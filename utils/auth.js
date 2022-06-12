const jwt = require("jsonwebtoken");
const verify = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) res.status(401).json("Invalid Token");
      else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(401).json("Unauthenticated");
  }
};

module.exports = verify;
