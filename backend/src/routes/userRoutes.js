const express = require('express');
const Router = express.Router();

const { login, register, addToHistory, getUserHistory } = require("../controllers/userController");

Router.route("/login").post(login);
Router.route("/register").post(register);
Router.route("/add_to_activity").post(addToHistory);
Router.route("/get_all_activity").get(getUserHistory);

module.exports = Router;