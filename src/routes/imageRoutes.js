const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth')
const multer = require("multer")
const multerConfig = require("../config/multer")

const postController = require("../controller/postController")

router.use(authMiddleware)

// Gallery Routes
router.post('/', multer(multerConfig).single("file"), postController.newPost)
router.get('/', postController.getImages)
router.delete('/:id', postController.delete)

module.exports = router