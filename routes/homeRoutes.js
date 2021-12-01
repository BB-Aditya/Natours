const homeController = require(`../controllers/homeController`);

const Router = require('express').Router();

Router.route('/').get(homeController.getHome).post(homeController.postHome);

module.exports = Router;
