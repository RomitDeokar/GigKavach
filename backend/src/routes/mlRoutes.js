const express = require('express');
const router = express.Router();
const { predictFraud, predictPrice, predictRisk, predictClaim } = require('../controllers/mlController');

router.post('/fraud', predictFraud);
router.post('/price', predictPrice);
router.post('/risk', predictRisk);
router.post('/claim', predictClaim);

module.exports = router;