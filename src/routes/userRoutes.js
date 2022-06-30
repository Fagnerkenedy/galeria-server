const express = require("express");
const router = express.Router();

const authController = require("../controller/authController")

router.get('/', (req, res) => {res.send('Nothing Here!')});

// User Routes
router.post('/register', authController.register)
router.post('/authenticate', authController.authenticate)

module.exports = router