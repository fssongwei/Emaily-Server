module.exports = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.send({ isLogin: false });
};
