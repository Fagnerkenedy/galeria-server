const mongoose = require('../database')

const contatoSchema = new mongoose.Schema({
    tipo: { type: String, required: false },
    categoria: { type: String, required: true },
    nome: { type: String, required: false },
    sobrenome: { type: String, required: false },
    nascimento: { type: Date, required: false },
    cpf: { type: String, required: false },
    rg: { type: String, required: false },
    sexo: { type: String, required: false },
    telefone: { type: String, required: false },
    celular: { type: String, required: false },
    email: { type: String, required: false },
    site: { type: String, required: false },
    instagram: { type: String, required: false },
    facebook: { type: String, required: false },
    empresa: { type: String, required: false },
    cnpj: { type: String, required: false },
    inscricao_estadual: { type: String, required: false },
    endereco: { type: String, required: false },
    numero: { type: String, required: false },
    cep: { type: String, required: false },
    bairro: { type: String, required: false },
    cidade: { type: String, required: false },
    complemento: { type: String, required: false },
    estado: { type: String, required: false },
    pais: { type: String, required: false },
    senha: { type: String, required: false },
    status: { type: String, required: false }
})

const Contato = mongoose.model('Contato', ContatoSchema)
module.exports = Contato
