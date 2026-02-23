const express = require("express");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const routes = express.Router();

routes.route("/register").post(register);
routes.route("/login").post(login);
routes.route("/forgot-Password").post(forgotPassword);
routes.route("/resetPassword/:id/:token").post(resetPassword);

module.exports = routes;
