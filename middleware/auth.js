const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");


function authenticateJWT(req, res, next) {
  try {
    const tokenFromBody = req.body._token;
    const payload = jwt.verify(tokenFromBody, SECRET_KEY);
    req.user = payload;
    return next();
  } catch (err) {
    return next();
  }
}


function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    return next({ status: 401, message: "Unauthorized" });
  } else {
    return next();
  }
}


function ensureCorrectUser(req, res, next) {
  try {
    if (req.user.username === req.params.username) {
      return next();
    } else {
      return next({ status: 401, message: "Unauthorized" });
    }
  } catch (err) {
    return next({ status: 401, message: "Unauthorized" });
  }
}

function ensureAdmin(req, res, next){
  if (req.user){
    if (req.user.is_admin === true) {
      return next();
    } else {
      return next({ status: 401, message: "Unauthorized. Admin access is required" });
    }
  } else {
    return next({ status: 401, message: "Please log in first" });
  }
  // if (req.user.is_admin === false){
  //   return next({ status: 401, message: "Unauthorized" });
  // } else {
  //   return next();
  // }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
  ensureAdmin
};
