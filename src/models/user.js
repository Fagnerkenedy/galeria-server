const mongoose = require('../database')
const bcrypt = require('bcryptjs')


const UserSchema = new mongoose.Schema({
    uuid: { // id unico, será usado para validações do usuário, como verificação de email.
        type: String,
    },
    name: { 
        type: String,
        required: true,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    sitename: { // sera usado para o subdomínio
        type: String,
        //required: true,
        lowercase: true,
    },
    verificado: { // campo para informar se o usuário confirmou seu email ou não.
        type: Boolean,
        default: false,
    },
    phone: { // só celular, ninguem mais tem telefone fixo
        type: String,
    },
    site: { // site do cliente mesmo
        type: String,
    },
    instagram: {
        type: String,
    },
    facebook: {
        type: String,
    },
    endereco: {
        type: String,
    },
    numero:{ // numero do endereço
        type: String,
    },
    bairro: {
        type: String,
    },
    cidade: {
        type: String,
    },
    estado: {
        type: String,
    },
    pais: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

UserSchema.pre('save', async function(){
    if(!this.password)
        return
        
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
})

const User = mongoose.model('User', UserSchema)

module.exports = User