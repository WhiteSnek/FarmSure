const express = require('express');

//Controller Functions
const {signup, login, getCropPrices} = require('../controllers/controller');

const router = express.Router();

//Login route
router.post('/login', login);

//Signup route
router.post('/signup', signup);

router.post('/crop-prices', getCropPrices);

module.exports = router