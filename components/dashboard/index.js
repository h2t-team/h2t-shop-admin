const express = require('express');
const { checkAuthentication } = require('../../auth/auth');
const router = express.Router();

const controller = require('./dashboardController');

/* GET home page. */
router.get('/', checkAuthentication, controller.dashboard);
router.get('/dashboard', checkAuthentication, controller.dashboard);

module.exports = router;