var mongoose = require('mongoose')

var compositorSchema = new mongoose.Schema({ // esquema de um compositor
    _id: String,
    nome: String,
    bio: String,
    dataNasc: String,
    dataObito: String,
    // periodo: { // isto seria a maneira de indicar se cada campo tivesse o seu nome, mas eu meti no formato lista de Strings
    //     periodo_id: String,
    //     periodo_nome: String
    // }
    periodo: [String]
}, {versionKey: false, collection: 'compositores'}) // "collection:..." para forçar utilizar a coleção compositores da database, senão ele tentava ir buscar a coleção "compositors"!

module.exports = mongoose.model('compositor',compositorSchema) // modelo chamado compositor 