const express = require('express');

//Controller Functions
const {signup, login, getCropPrices, getGovtSchemes} = require('../controllers/controller');

const router = express.Router();

//Login route
router.post('/login', login);

//Signup route
router.post('/signup', signup);

router.post('/crop-prices', getCropPrices);
router.get('/govt-schemes', getGovtSchemes);

module.exports = router