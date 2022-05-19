const express = require('express');
const router = express.Router();

const userController = require('./userController');

/* GET users page. */
router.get('/', userController.list);

// get user search
router.get('/search', userController.search);

// lock user
router.post('/lockuser', userController.lockUser);

// get user detail
router.get('/:userId', userController.detail);

module.exports = router;