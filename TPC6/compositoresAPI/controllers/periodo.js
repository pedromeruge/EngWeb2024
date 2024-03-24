var Periodo = require("../models/periodo")

module.exports.list = () => { // query 
    return Periodo
        .find()
        .sort({_id:1}) // sort dos resultados devolvidos por nome crescente
        .exec()
}

module.exports.findById = id => {
    return Periodo
        .findOne({_id: id})
        .exec()
}

module.exports.insert = periodo => {
    return Periodo.create(periodo) // catch do erro (se ocorrer) está no roteador
}

module.exports.updatePeriodo = (periodo_id, periodo) => {
    return Periodo.findOneAndUpdate({_id: periodo_id}, periodo, { new: true })
}

// n está a funcioanr ..:!:!:!
// module.exports.patch = (periodo_id, periodo) => {
//     var res = Periodo.findByIdAndUpdate({_id: periodo_id}, periodo, {upsert: false, new: true})// upsert false impede criar entrada nova se n existir na BD! // new true devolve entrada atualizada inteira
//     return res
// };

module.exports.deletePeriodoById = id => {
    return Periodo.findOneAndDelete({
        _id: id
    });
}