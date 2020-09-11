module.exports = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.status(400).send({ msg: "Unauthorize access!" });
};
