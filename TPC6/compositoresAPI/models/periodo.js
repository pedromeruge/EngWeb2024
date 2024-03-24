var mongoose = require('mongoose')

var periodoSchema = new mongoose.Schema({ // esquema de um compositor
    _id: String,
    nome: String,
    data: String,
    descricao: String,
    // compositores: [ 
    // { // isto seria a maneira de indicar se cada campo tivesse o seu nome, mas eu meti no formato lista de Strings
    //     periodo_id: String,
    //     periodo_nome: String
    // }]
    compositores: [
        [String]
    ]
}, {versionKey: false, collection: 'periodos'}) // "collection:..." para forçar utilizar a coleção compositores da database, senão ele tentava ir buscar a coleção "compositors"!

module.exports = mongoose.model('periodo',periodoSchema) // modelo chamado compositor 