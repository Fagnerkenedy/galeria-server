const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth')

const galleryController = require("../controller/galleryController")

router.use(authMiddleware)

// Gallery Routes
router.get('/count/:user?', galleryController.count)
router.get('/:user?/:galleryId?', galleryController.getGalleries)
//router.get('/byId/:userId', galleryController.getById)

router.post('/', galleryController.newGallery)
router.put('/:galleryId/:userId', galleryController.updateGallery)
router.get('/*', (req, res) => res.status(404).json({ success: false, message: 'Rota não encontrada!' }))

module.exports = router