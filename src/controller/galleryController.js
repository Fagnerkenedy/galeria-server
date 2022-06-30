
const Galeria = require('../models/galeria')
const Image = require('../models/image')

module.exports = {
    count: (req, res) => {
        Galeria.count((err, value) => {
            if(!err){
                res.json({value})
            } else {
                res.status(500).json({errors: [err]})
            }
        })
    },

    getGalleries: async (req, res) => {
        try {
            const galerias = await Galeria.find().populate('user').skip(req.query.skip).limit(req.query.limit)

            return res.send({ galerias })
        } catch (err) {
            return res.status(400).send({ status: "error", message: "Houve um erro ao listar as galerias", retorno: err })
        }
    },

    getById: async (req, res) => {
        try {
            const galeria = await Galeria.findById(req.params.galleryId).populate('user')

            return res.send({ galeria })
        } catch (err) {
            return res.status(400).send({ status: "error", message: "Houve um erro ao listar a galeria", retorno: err })
        }
    },

    newGallery: async (req, res) => {
        try {
            
            const { title, images } = req.body

            const galeria = await Galeria.create({ title, user: req.userId })

            await Promise.all(images.map( async image => {
                const galeryImg = new Image({ ...image, galeria: galeria._id })
                galeryImg.save()
                galeria.images.push(galeryImg)
            }))

            await galeria.save()

            return res.send({ status: "success", message: "Galeria criada com sucesso", retorno: galeria })

        } catch (err) {
            return res.status(400).send({ status: "error", message: "Houve um erro ao cadastrar a galeria", retorno: err })
        }

    },
    updateGallery: async (req, res) => {
        res.send({ ok: "ok Put", userId: req.userId })
    }
}