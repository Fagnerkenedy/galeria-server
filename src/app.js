require('dotenv').config()

const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const app = express()
const server = require("http").createServer(app)
const queryParser = require('express-query-int')
const morgan = require('morgan')
const path = require("path")

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(queryParser())
app.use(morgan('dev'))

// Caminho das imagens quando salvas no disco.
app.use('/files', express.static(path.resolve(__dirname, "..", "tmp", "uploads")))

app.use('/auth', require("./routes/userRoutes"))
app.use('/gallery', require("./routes/galleryRoutes"))
app.use('/posts', require("./routes/postRoutes"))

server.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server has initiated on port ${process.env.EXPRESS_PORT}`)
})
