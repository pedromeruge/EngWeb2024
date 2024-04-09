var express = require('express');
var router = express.Router();
var axios = require('axios');

router.get('/', function(req, res) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:3000')
    .then( resposta => {
      res.render('pessoasList', { data: resposta.data, date: d, titulo: "Gestão pessoas"}); //RECORDA: dados de axios vêm sempre em resposta com muitos campos -> res.data para extrair isso
  })
  .catch( erro => {
    res.render('pessoasError', {error: erro, date: d ,message: "Erro ao obter pessoas"})
    })
  });

router.get('/register', function(req, res) {
  var d = new Date().toISOString().substring(0, 16)
  res.render('pessoaForm', {date: d, titulo: "Criar Compositor"})
});

router.get('/edit/:id', (req,res) => {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:3000/' + req.params.id)
    .then( resposta => {
      console.log(resposta.data)
      res.render('pessoaFormEdit', {pessoa: resposta.data, date: d})
    }).catch( erro => {
      res.render('pessoasError', {error: erro, date: d, message: "Erro ao obter pessoa ao editar página "})
    })
})

router.get('/delete/:id', (req,res) => {
  var d = new Date().toISOString().substring(0, 16)

  axios.delete('http://localhost:3000/' + req.params.id)
    .then( resposta => {
      res.render("pessoa",{data: resposta.data, date: d})
    }).catch( erro => {
      res.render("pessoasError",{error: erro, message: "Couldnt retrieve pessoas from database", date: d});
    })
})

router.get('/:id', function(req, res) { // NOTA: :id vai capturar C26 inteiro, não apenas 26
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:3000/' + req.params.id) // NOTA: sempre que há rotas paramétricas aka com :id, ou algo do género, cria estrutura parameters no req, com os valores do url
    .then( resposta => {
      res.render('pessoa', { data: resposta.data, date: d, titulo: "Consultar informação pessoa"});
    })
    .catch( erro => {
      res.render('pessoasError', {error: erro, date: d, message: "Erro ao obter pessoa"})
    })
});

// POST ##### 
// ###### compositores POST
router.post('/register',function(req,res) {
  var d = new Date().toISOString().substring(0, 16)
  
  // Split desportos input into array
  var desportosArray = req.body.desportos.split(',').filter(str => str !== "");
  req.body.desportos = desportosArray

  var animaisArray = req.body.animais.split(',').filter(str => str !== "");
  req.body.animais = animaisArray

  var figurasPublicasArray = req.body.figura_publica_pt.split(',').filter(str => str !== "");
  req.body.figura_publica_pt = figurasPublicasArray

  var destinosFavoritosArray = req.body.destinos_favoritos.split(',').filter(str => str !== "");
  req.body.destinos_favoritos = destinosFavoritosArray;

  var formData = {
    nome: req.body.nome,
    idade: req.body.idade,
    sexo: req.body.sexo,
    morada: {
        cidade: req.body.moradaCidade,
        distrito: req.body.moradaDistrito
    },
    CC: req.body.CC,
    BI: req.body.BI,
    descrição: req.body.descrição,
    profissao: req.body.profissao,
    partido_politico: {
        party_abbr: req.body.partidoAbbr,
        party_name: req.body.partidoNome
    },
    religiao: req.body.religiao,
    desportos: req.body.desportos,
    animais: req.body.animais,
    figura_publica_pt: req.body.figura_publica_pt,
    marca_carro: req.body.marca_carro,
    destinos_favoritos: req.body.destinos_favoritos,
    atributos: {
        fumador: req.body.fumador === 'on',
        gosta_cinema: req.body.gostaCinema === 'on',
        gosta_viajar: req.body.gostaViajar === 'on',
        acorda_cedo: req.body.acordaCedo === 'on',
        gosta_ler: req.body.gostaLer === 'on',
        gosta_musica: req.body.gostaMusica === 'on',
        gosta_comer: req.body.gostaComer === 'on',
        gosta_animais_estimacao: req.body.gostaAnimaisEstimacao === 'on',
        gosta_dancar: req.body.gostaDancar === 'on',
        comida_favorita: req.body.comidaFavorita
    }
  }

  // Send the formatted data to the server
  axios.post('http://localhost:3000/', formData)
      .then(resposta => {
          res.render("pessoa", { data: resposta.data, date: d });
      })
      .catch(erro => {
          res.render("pessoasError", { error: erro, message: "compositores post action failed", date: d });
      });
})

router.post('/edit/:id',function(req,res) {
  var d = new Date().toISOString().substring(0, 16)
  
  // Split desportos input into array
  var desportosArray = req.body.desportos.split(',').filter(str => str !== "");
  req.body.desportos = desportosArray

  var animaisArray = req.body.animais.split(',').filter(str => str !== "");
  req.body.animais = animaisArray

  var figurasPublicasArray = req.body.figura_publica_pt.split(',').filter(str => str !== "");
  req.body.figura_publica_pt = figurasPublicasArray

  var destinosFavoritosArray = req.body.destinos_favoritos.split(',').filter(str => str !== "");
  req.body.destinos_favoritos = destinosFavoritosArray;

  var formData = {
    nome: req.body.nome,
    idade: req.body.idade,
    sexo: req.body.sexo,
    morada: {
        cidade: req.body.moradaCidade,
        distrito: req.body.moradaDistrito
    },
    CC: req.body.CC,
    BI: req.body.BI,
    descrição: req.body.descrição,
    profissao: req.body.profissao,
    partido_politico: {
        party_abbr: req.body.partidoAbbr,
        party_name: req.body.partidoNome
    },
    religiao: req.body.religiao,
    desportos: req.body.desportos,
    animais: req.body.animais,
    figura_publica_pt: req.body.figura_publica_pt,
    marca_carro: req.body.marca_carro,
    destinos_favoritos: req.body.destinos_favoritos,
    atributos: {
        fumador: req.body.fumador === 'on',
        gosta_cinema: req.body.gostaCinema === 'on',
        gosta_viajar: req.body.gostaViajar === 'on',
        acorda_cedo: req.body.acordaCedo === 'on',
        gosta_ler: req.body.gostaLer === 'on',
        gosta_musica: req.body.gostaMusica === 'on',
        gosta_comer: req.body.gostaComer === 'on',
        gosta_animais_estimacao: req.body.gostaAnimaisEstimacao === 'on',
        gosta_dancar: req.body.gostaDancar === 'on',
        comida_favorita: req.body.comidaFavorita
    }
  }

  axios.put('http://localhost:3000/' + req.params.id, formData)
  .then( resposta => {
    res.render("pessoa",{data: resposta.data, date: d})
  })
  .catch( erro => {
    res.render("pessoasError",{error: erro, message: "Failed to update pessoa in database", date: d});
  })
})

module.exports = router;