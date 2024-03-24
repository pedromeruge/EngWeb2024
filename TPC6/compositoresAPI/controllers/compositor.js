var Compositor = require("../models/compositor")

module.exports.list = () => { // query 
    return Compositor
        .find()
        .sort({name:1}) // sort dos resultados devolvidos por nome crescente
        .exec()
}

module.exports.findById = id => {
    return Compositor
        .findOne({_id: id})
        .exec()
}

module.exports.insert = compositor => {
    return Compositor.create(compositor) // catch do erro (se ocorrer) está no roteador
}

module.exports.updateCompositor = (comp_id, compositor) => {
    return Compositor.findOneAndUpdate({_id: comp_id}, compositor, {new: true})
}

module.exports.deleteCompositorById = id => {
    return Compositor.findOneAndDelete({
        _id: id
    });
}