const Post = require("../models/image")

module.exports = {
    newPost: async (req, res) => {
        const { originalname: name, size, key, location: url = "" } = req.file;
        const post = await Post.create({
            name,
            size,
            key,
            url
        })
        return res.json(post)
    },

    getImages: async (req, res) => {
        const images = await Post.find()

        return res.json(images)
    },
    
    delete: async (req, res) => {
        const img = await Post.findById(req.params.id);

        await img.remove();

        return res.send("Removeu");
    }

}