const Movies = require("../models/Movies");

// Middleware check token
const checkAuthMiddleware = async (req, res, next) => {
  // Neu khong ton tai authorization
  if (!req.headers.authorization) {
    console.log("NOT AUTH. AUTH HEADER MISSING.");
    return res.status(401);
  }
  const authFragments = req.headers.authorization.split(" ");

  // Neu authorization sai cu phap
  if (authFragments.length !== 2) {
    console.log("NOT AUTH. AUTH HEADER INVALID.");
    return res.status(401);
  }

  const authToken = authFragments[1];
  // Check token co ton tai trong userToken hay khong
  Movies.userToken((tokensList) => {
    if (!tokensList.find((userToken) => userToken.token === authToken))
      return res.status(401);
  });

  next();
};

exports.checkAuth = checkAuthMiddleware;
