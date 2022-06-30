require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
mongoose.Promise = global.Promise

module.exports = mongoose