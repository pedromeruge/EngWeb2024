var express = require('express');
var router = express.Router();
var Periodo = require('../controllers/periodo');

/* GET home page. */
router.get('/', function(req, res, next) {
  Periodo.list()
    .then(data => res.status(201).jsonp(data))
    .catch(erro => res.status(521).jsonp(erro))
});

router.get('/:id', function(req,res) {
  Periodo.findById(req.params.id)
    .then(data => res.status(202).jsonp(data))
    .catch(erro => res.status(522).jsonp(erro))
});

router.post('/', function(req,res) {
  Periodo.insert(req.body)
  .then(data => res.status(203).jsonp(data))
  .catch(erro => res.status(523).jsonp(erro))
});

// n consegui meter a funcionar este
// router.patch('/:id', function(req,res) { 
//   Periodo.patch(req.params.id, req.body)
//     .then(data => res.status(204).jsonp(data))
//     .catch(erro => res.status(524).jsonp(erro))
// });

router.put('/:id', (req,res) => {
  Periodo.updatePeriodo(req.params.id, req.body)
  .then(data => res.status(205).jsonp(data))
  .catch(erro => res.status(525).jsonp(erro))
});

router.delete('/:id', (req,res) => {
  Periodo.deletePeriodoById(req.params.id, req.body)
  .then(data => res.status(206).jsonp(data))
  .catch(erro => res.status(526).jsonp(erro))
});

module.exports = router;
