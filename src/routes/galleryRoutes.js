const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth')

const galleryController = require("../controller/galleryController")

router.use(authMiddleware)

// Gallery Routes
router.get('/count', galleryController.count)
router.get('/', galleryController.getGalleries)
router.get('/:galleryId', galleryController.getById)

router.post('/', galleryController.newGallery)
router.put('/:galleryId', galleryController.updateGallery)

module.exports = router