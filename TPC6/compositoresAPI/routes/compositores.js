var express = require('express');
var router = express.Router();
var Compositor = require('../controllers/compositor');

/* GET home page. */
router.get('/', function(req, res, next) {
  Compositor.list()
    .then(data => res.status(201).jsonp(data))
    .catch(erro => res.status(521).jsonp(erro))
});

router.get('/:id', function(req,res) {
  Compositor.findById(req.params.id)
    .then(data => res.status(202).jsonp(data))
    .catch(erro => res.status(522).jsonp(erro))
});

router.post('/', function(req,res) {
  Compositor.insert(req.body)
  .then(data => res.status(203).jsonp(data))
  .catch(erro => res.status(523).jsonp(erro))
});

// NOTA: o status 204 INDICA NO CONTENT, CUIDADO !!!! NAO USAR
router.put('/:id', (req,res) => {
  Compositor.updateCompositor(req.params.id, req.body)
  .then(data => res.status(205).jsonp(data))
  .catch(erro => res.status(525).jsonp(erro))
});

router.delete('/:id', (req,res) => {
  Compositor.deleteCompositorById(req.params.id, req.body)
  .then(data => res.status(206).jsonp(data))
  .catch(erro => res.status(526).jsonp(erro))
});

module.exports = router;
