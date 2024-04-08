var Pessoa = require("../models/pessoa")

module.exports.list = () => { // query 
    return Pessoa
        .find()
        .sort({_id:1}) // sort dos resultados devolvidos por id crescente
        .exec()
}

// NOTA: SEM ASYNC ESTA FUNÇÃO NAO FUNCIONA !!!
module.exports.listModalidades = async () => { // query 
    try {
        const todasModalidades = await Pessoa.find({}, {desportos:1,_id:0}).exec(); // find só constroi o pedido da query, exec envia efetivamente o pedido
        const uniqueModalidades = new Set();
        todasModalidades.forEach(entry => {
            entry.desportos.forEach(modalidade => {
                uniqueModalidades.add(modalidade);
            });
        });
        return Array.from(uniqueModalidades).sort() // ordenar alfabeticamente
    } catch (error) {
        console.error("Error fetching modalidades:", error);
        throw new Error("Internal server error");
    }
}

module.exports.findById = id => {
    return Pessoa
        .findOne({_id: id})
        .exec()
}

module.exports.findByModalidade = modalidade => {
    return Pessoa
        // se fosse só para retornar o nome do jogador em vez de o objeto todo, mudar para find ".find({ desportos: { $in: [modalidade] }}, {nome: 1, _id:0})" e meter tudo num array como no listModalidades
        .find({ desportos: { $in: [modalidade] }})
        .sort({nome: 1})
        .exec()
}

module.exports.insert = pessoa => {
    return Pessoa.create(pessoa) // catch do erro (se ocorrer) está no roteador
}

module.exports.updatePessoa = (pessoa_id, Pessoa) => {
    return Pessoa.findOneAndUpdate({_id: pessoa_id}, Pessoa, {new: true})
}

module.exports.deletePessoaById = id => {
    return Pessoa.findOneAndDelete({
        _id: id
    });
}