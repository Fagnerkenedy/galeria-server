const express = require("express");
const router = express.Router();

const authController = require("../controller/authController")

const authForUserApis = require("../middleware/authForUserApis")

router.use(authForUserApis)

router.get('/', (req, res) => {res.status(200).json( {success: true, message: "You're Lost, There's Nothing Here!"})})

// User Routes
router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/checksitename', authController.checkSiteName)
router.post('/checkemail', authController.checkEmail)
router.post('/mailconfirmation', authController.sendMailConfirmation)
router.post('/confirmation', authController.confirmation)
router.put('/update', authController.update)
router.get('/myaccount', authController.getUser)

module.exports = router