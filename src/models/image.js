const mongoose = require('../database')
const aws = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const s3 = new aws.S3()

const ImageSchema = new mongoose.Schema({
    size: Number,
    key: String,
    url: String,
    galeria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Galeria'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

ImageSchema.pre('save', function() {
    if(!this.url) {
        this.url = `${process.env.APP_URL}/files/${this.key}`
    }
})

ImageSchema.pre('remove', function(){
    if(process.env.STORAGE_TYPE === 's3'){
        return s3.deleteObject({
            Bucket: process.env.AWS_BUCKET,
            Key: this.key,
        }).promise()
    }else{
        return promisify(fs.unlink)(path.resolve(__dirname, "..", "..", "tmp", "uploads", this.key))
    }

})

const Image = mongoose.model('Image', ImageSchema)

module.exports = Image