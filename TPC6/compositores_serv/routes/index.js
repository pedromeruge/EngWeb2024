var express = require('express');
var router = express.Router();
var axios = require('axios');

// GETS ##### 
router.get('/', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  res.render('index', { title: 'Gestao de compositores e periódos',date: d});
});

// ###### compositores GETS
router.get('/compositores', function(req, res) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:3000/compositores')
    .then( resposta => {
      res.render('compositoresList', { data: resposta.data, date: d, titulo: "Gestão Compositores"}); //RECORDA: dados de axios vêm sempre em resposta com muitos campos -> res.data para extrair isso
  })
  .catch( erro => {
    res.render('compositoresError', {error: erro, date: d ,message: "Erro ao obter compositores."})
    })
  });

  // tem de vir antes do compositores/idCompositor, senão dava matches errado
router.get('/compositores/register', function(req, res) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:3000/periodos')
    .then (resposta => {
      res.render('compositorForm', {data: resposta.data, date: d, titulo: "Criar Compositor"})
    }).catch( erro => {
      res.render('compositoresError', {error: erro, date: d, message: "Erro ao obter periodos para página registar"})
    })
});

router.get('/compositores/:id', function(req, res) { // NOTA: :id vai capturar C26 inteiro, não apenas 26
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:3000/compositores/' + req.params.id) // NOTA: sempre que há rotas paramétricas aka com :id, ou algo do género, cria estrutura parameters no req, com os valores do url
    .then( resposta => {
      res.render('compositor', { data: resposta.data, date: d, titulo: "Consultar Compositor"});
    })
    .catch( erro => {
      res.render('compositoresError', {error: erro, date: d, message: "Erro ao obter compositor"})
    })
});

router.get('/compositores/edit/:id', (req,res) => {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:3000/compositores/' + req.params.id)
    .then( compositorResposta => {
      axios.get('http://localhost:3000/periodos')
      .then (periodosResposta => {
        res.render('compositorFormEdit', {periodos: periodosResposta.data, compositor: compositorResposta.data, date: d})
      }).catch( erro => {
          res.render("compositoresError", {error: erro, date: d, message: "Erro ao obter periodos ao editar página "})
      })
    }).catch( erro => {
      res.render("compositoresError", {error: erro, date: d, message: "Erro ao obter compositor ao editar página "})
    })
})

router.get('/compositores/delete/:id', (req,res) => {
  var d = new Date().toISOString().substring(0, 16)

  axios.delete('http://localhost:3000/compositores/' + req.params.id)
    .then( respostaCompositores => {
      var compositor = respostaCompositores.data
      axios.get('http://localhost:3000/periodos')
        .then(respostaPeriodos => {

            const todosPeriodos = respostaPeriodos.data;
            const periodoToUpdate = todosPeriodos.find( p => p._id === compositor.periodo[0])

            if (periodoToUpdate) {
                periodoToUpdate.compositores = periodoToUpdate.compositores.filter( c => c[0] !== compositor._id)

                axios.put(`http://localhost:3000/periodos/${periodoToUpdate._id}`,periodoToUpdate)
                . then(() => {
                    res.render("compositor",{data: compositor, date: d})
                })
                .catch(erro => {
                    res.render("compositoresError",{error: erro, message: "Error updating periodo in the database", date: d});
                });
            } else {
              res.render("compositoresError",{error: erro, message: "Periodo not found in the database", date: d});
            }
        })
        .catch(erro => {
            res.render("compositoresError",{error: erro, message: "Couldnt retrieve periodos from database", date: d});

        })
    }).catch( erro => {
      res.render("compositoresError",{error: erro, message: "Couldnt retrieve compositores from database", date: d});
    })
})

// ###### periodos GETS

router.get('/periodos', function(req, res) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:3000/periodos')
    .then( resposta => {
      res.render('periodosList', { data: resposta.data, date: d, titulo: "Gestão Períodos"});
  })
  .catch( erro => {
    res.render('periodosError', {error: erro, date: d ,message: "Erro ao obter períodos."})
    })
  });

  // tem de vir antes do periodo/idPeriodo, senão dava matches errado
router.get('/periodos/register', function(req, res) {
  var d = new Date().toISOString().substring(0, 16)
  res.render('periodoForm', {date: d, titulo: "Criar Compositor"})

});

router.get('/periodos/:id', function(req, res) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:3000/periodos/' + req.params.id)
    .then( resposta => {
      res.render('periodo', { data: resposta.data, date: d, titulo: "Consultar Período"});
    })
    .catch( erro => {
      res.render('periodosError', {error: erro, date: d, message: "Erro ao obter periodo"})
    })
});

router.get('/periodos/edit/:id', (req,res) => {
  var d = new Date().toISOString().substring(0, 16)

  axios.get('http://localhost:3000/periodos/' + req.params.id)
  .then (periodosResposta => {
    res.render('periodoFormEdit', {periodo: periodosResposta.data, date: d})
  }).catch( erro => {
      res.render("periodosError", {error: erro, date: d, message: "Erro ao obter periodo ao editar página "})
  })
})

router.get('/periodos/delete/:id', (req,res) => {
  var d = new Date().toISOString().substring(0, 16)

  axios.get('http://localhost:3000/periodos/' + req.params.id)
    .then( respostaPeriodo => {
        if (respostaPeriodo.data.compositores.length === 0) {
            axios.delete('http://localhost:3000/periodos/' + req.params.id)
            .then( respostaDelete => {
                res.render("periodo", { data: respostaDelete.data, date: d})
            }).catch( erro => {
                res.render("periodosError", {error: erro, date: d, message: "Erro ao apagar periodo da DB"})
            })
        } else {
            res.render("periodosError",{error: "Erro", message:"Remover todos os compositores do periodo, para poder realizar esta operação", date: d})
        }
    }).catch( erro => {
        res.render("periodosError", {message:"Erro a encontrar o periodo na database", date: d})
    })
})

// POST ##### 
// ###### compositores POST
router.post('/compositores/register',function(req,res) {
  var d = new Date().toISOString().substring(0, 16)
  
  //NOTA: o que antes era result, agora é req.body com o express
  const periodoTuple = JSON.parse(req.body.periodo)

  req.body.periodo = periodoTuple;

  axios.post('http://localhost:3000/compositores', req.body)
    .then( respostaCompositores => {

      axios.get('http://localhost:3000/periodos')
        .then(respostaPeriodos => {

          const todosPeriodos = respostaPeriodos.data;
          const periodoToUpdate = todosPeriodos.find( p => p._id === req.body.periodo[0])

          if (periodoToUpdate) {
              periodoToUpdate.compositores.push([req.body._id,req.body.nome]) // acrescentar novo compositor à lista de compositores desse período

              axios.put(`http://localhost:3000/periodos/${periodoToUpdate._id}`,periodoToUpdate)
              . then(() => {
                  res.render("compositor", {data: respostaCompositores.data, date: d})
              })
              .catch(erro => {
                  res.render("compositoresError", {error: erro, message: "Error updating periodo in the database", date: d});
              });
          } else {
              res.render("compositoresError", {error: erro, message: "Periodo not found in the database", date: d});
          }
        })
        .catch(erro => {
          res.render("periodosError", {error: erro, message: "Failed to retrieve periodos from database", date: d});
        })
    })
    .catch( erro => {
      res.render("compositoresError", {error: erro, message: "compositores post action failed", date: d});
    })
})

router.post('/compositores/edit/:id',function(req,res) {
  var d = new Date().toISOString().substring(0, 16)
  
  const novoPeriodoTuple = JSON.parse(req.body.periodo)

  req.body.periodo = novoPeriodoTuple;

  const periodoPrevioTuple = JSON.parse(req.body.periodoInicial) // aceder a periodo antes da alteração

  delete req.body.periodoInicial

  axios.put('http://localhost:3000/compositores/' + req.params.id, req.body)
  .then( respostaCompositores => {
    console.log("Dentro de resposta compositores")
    console.log(respostaCompositores)
      //comparação !== de javascript baseia-se em id de instância de objetos e não em conteúdo para tipos complexos!!! para tipos primitivios é o compare normal
      if (novoPeriodoTuple[0] !== periodoPrevioTuple[0]) { // se utilizador mudou de id de período (aka modou de periodo), atualizar as respetivas listas dos períodos
          
          axios.get('http://localhost:3000/periodos')
          .then(respostaPeriodos => {

              const todosPeriodos = respostaPeriodos.data;
              const novoPeriodo = todosPeriodos.find( p => p._id === novoPeriodoTuple[0])
              const  previoPeriodo = todosPeriodos.find( p => p._id === periodoPrevioTuple[0])

              if (novoPeriodo && previoPeriodo) {
                  novoPeriodo.compositores.push([req.body._id,req.body.nome]) // acrescentar novo compositor à lista de compositores desse período
                  previoPeriodo.compositores = previoPeriodo.compositores.filter( c => c[0] !== req.params.id)

                  axios.put(`http://localhost:3000/periodos/${novoPeriodo._id}`,novoPeriodo) // atualizar periodo antigo
                  . then(() => {
                      axios.put(`http://localhost:3000/periodos/${previoPeriodo._id}`,previoPeriodo) //atualizar periodo novo
                          . then(() => {
                              console.log(respostaCompositores.data)
                              res.render("compositor",{data: respostaCompositores.data, date: d})
                      
                          })
                          .catch(erro => {
                              res.render("compositoresError",{error: erro, message: "Error updating prev periodo in the database", date: d});
                          });                                  
                  })
                  .catch(error => {
                    console.log("Resposta from compositores")
                    res.render("compositoresError",{error: erro, message: "Error updating novo periodo in the database", date: d});
                  })
              } else {
                res.render("compositoresError",{error: erro, message: "Periodo not found in the database", date: d});
              }
          })
          .catch( erro => {
            res.render("compositoresError",{error: erro, message: "Failed to retrieve periodos from database", date: d});
        })
      }
      else {
        console.log("Resposta from compositores")
        console.log(respostaCompositores.data)
        res.render("compositor",{data: respostaCompositores.data, date: d})
      }
  })
  .catch( erro => {
    res.render("compositoresError",{error: erro, message: "Failed to update compositor in database", date: d});
  })
})

router.post('/periodos/register',function(req,res) {
  var d = new Date().toISOString().substring(0, 16)

  req.body.compositores = []

  axios.post('http://localhost:3000/periodos', req.body)
  .then( resposta => {
      res.render("periodo",{data: resposta.data, date: d})
  })
  .catch( erro => {
      res.render("periodosError",{error: erro, message: "Failed to post periodo in database", date: d})
  })
})

router.post('/periodos/edit/:id', function(req, res) {
  var d = new Date().toISOString().substring(0, 16)

  axios.put('http://localhost:3000/periodos/' + req.params.id, req.body)
    .then( resposta => {
        res.render("periodo",{data: resposta.data, date: d})
    })
    .catch( erro => {
        res.render("periodosError", {error: erro, date: d, message: "Erro editing periodos"})
    })
})

module.exports = router;
