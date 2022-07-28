const User = require('../models/user')
const Galeria = require('../models/gallery')
const Image = require('../models/image')

module.exports = {
    count: (req, res) => {
        const { user }  = req.params
        console.log(user)
        if(!user || user === undefined)
            return res.status(404).json({ success: false, message: 'Usuário não informado' })
        
        Galeria.count({ user: user }, (error, count) => {
            if(!error){
                res.status(200).json({ success: true, count })
            } else {
                res.status(500).json({ success: false, message: [error] })
            }
        })
    },

    getGalleries: async (req, res) => {

        const { user, galleryId } = req.params

        /*if(!user)
            return res.status(404).json({ success: false, message: 'Usuário não informado' })*/

        if(!galleryId){
            try {
                const galerias = await Galeria.find({ user }).populate('user').skip(req.query.skip).limit(req.query.limit)
                if(!galerias || galerias == '')
                    return res.status(404).json({ success: true, data: 'Nenhuma galeria encontrada' })
                return res.status(200).json({ success: true, data: galerias })
            } catch (error) {
                return res.status(400).send({ success: false, message: "Houve um erro ao listar as galerias", error })
            }
        }else{

            try {
                const galeria = await Galeria.find( { _id: galleryId } )

                if(!galeria || galeria == '')
                    return res.status(404).json({ success: true, data: 'Nenhuma galeria encontrada' })

                return res.status(200).json({ success: true, data: galeria })
            } catch (error) {
                return res.status(400).send({ success: false, message: "Houve um erro ao listar a galeria", error })
            }

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