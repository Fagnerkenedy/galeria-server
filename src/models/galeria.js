const mongoose = require('../database')

const GaleriaSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Images'
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Galeria = mongoose.model('Galeria', GaleriaSchema)

module.exports = Galeria