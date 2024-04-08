var express = require('express');
var router = express.Router();
var Pessoa = require('../controllers/pessoa');

router.get('/', function(req, res, next) {
  Pessoa.list()
    .then(data => res.status(201).jsonp(data))
    .catch(erro => res.status(523).jsonp(erro))
});

router.get('/modalidades', function(req,res) {
  Pessoa.listModalidades()
    .then(data => res.status(201).jsonp(data))
    .catch(erro => res.status(522).jsonp(erro))
});

router.get('/modalidades/:modalidade', function(req,res) {
  Pessoa.findByModalidade(req.params.modalidade)
    .then(data => res.status(201).jsonp(data))
    .catch(erro => res.status(526).jsonp(erro))
});

// NOTA: ESTA EXPRESSAO TEM DE VIR DEPOIS DE /MODALIDADES, SENAO A OUTRA ROTA IA PARAR AQUI!!!
router.get('/:id', function(req,res) {
  Pessoa.findById(req.params.id)
    .then(data => res.status(201).jsonp(data))
    .catch(erro => res.status(522).jsonp(erro))
});

router.post('/', function(req,res) {
  Pessoa.insert(req.body)
  .then(data => res.status(201).jsonp(data))
  .catch(erro => res.status(527).jsonp(erro))
});

router.put('/:id', (req,res) => {
  Pessoa.updatePessoa(req.params.id, req.body)
  .then(data => res.status(201).jsonp(data))
  .catch(erro => res.status(528).jsonp(erro))
});

router.delete('/:id', (req,res) => {
  Pessoa.deletePessoaById(req.params.id, req.body)
  .then(data => res.status(201).jsonp(data))
  .catch(erro => res.status(529).jsonp(erro))
});

module.exports = router;
