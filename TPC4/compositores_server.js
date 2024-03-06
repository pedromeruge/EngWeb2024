var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./compositoresTemplates.js')
var templates2 = require('./periodosTemplates.js')
var static = require('./static.js')

// Aux functions
function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

var compositoresServer = http.createServer((req, res) => {
    // Logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Handling request
    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                // GET /compositores --------------------------------------------------------------------
                if(req.url == '/compositores'){
                    axios.get('http://localhost:3000/compositores')
                    .then( resposta => {
                        res.writeHead(200, {'Content-Type' : 'text/html'})
                        res.end(templates.compositoresListPage(resposta.data, d))
                    }).catch( erro => {
                        res.writeHead(520, {'Content-Type' : 'text/html'})
                        res.end(templates.compositoresErrorPage(erro, d))
                    })
                }

                // GET /compositores/Cid --------------------------------------------------------------------
                else if(/\/compositores\/C[0-9]+$/.test(req.url)){
                    axios.get('http://localhost:3000' + req.url)
                    .then( resposta => {
                        res.writeHead(200, {'Content-Type' : 'text/html'})
                        res.end(templates.compositorPage(resposta.data, d))
                    }).catch( erro => {
                        res.writeHead(520, {'Content-Type' : 'text/html'})
                        res.end(templates.compositorPage(erro, d))
                    })
                }
                
                // GET /compositores/register --------------------------------------------------------------------
                else if(req.url == '/compositores/register'){
                    axios.get('http://localhost:3000/periodos')
                    .then (resposta => {
                        res.writeHead(200, {'Content-Type' : 'text/html'})
                        res.end(templates.compositorFormPage(resposta.data,d))
                    }).catch( erro => {
                        res.writeHead(520, {'Content-Type' : 'text/html'})
                        res.end(templates.compositoresErrorPage(erro, d))
                    })
                }
                
                // GET /compositores/edit/:id --------------------------------------------------------------------
                else if(/\/compositores\/edit\/C[0-9]+$/.test(req.url)){
                    let pieces = req.url.split('/')

                    let idCompositor = pieces[pieces.length - 1]

                    axios.get('http://localhost:3000/compositores/' + idCompositor)
                    .then( compositorResposta => {
                        axios.get('http://localhost:3000/periodos')
                        .then (periodosResposta => {
                            res.writeHead(200, {'Content-Type' : 'text/html'})
                            res.end(templates.compositorFormEditPage(periodosResposta.data,compositorResposta.data,d))
                        }).catch( erro => {
                            res.writeHead(521, {'Content-Type' : 'text/html'})
                            res.end(templates.compositoresErrorPage(erro, d))
                        })
                    }).catch( erro => {
                        res.writeHead(521, {'Content-Type' : 'text/html'})
                        res.end(templates.compositoresErrorPage(erro, d))
                    })
                }

                // GET /compositores/delete/:id --------------------------------------------------------------------
                else if(/\/compositores\/delete\/C[0-9]+$/.test(req.url)){
                    let pieces = req.url.split('/')

                    let idCompositor = pieces[pieces.length - 1]

                    axios.delete('http://localhost:3000/compositores/' + idCompositor)
                    .then( resposta => {
                        res.writeHead(200, {'Content-Type' : 'text/html'})
                        res.end(templates.compositorPage(resposta.data, d))
                    }).catch( erro => {
                        res.writeHead(521, {'Content-Type' : 'text/html'})
                        res.end(templates.compositoresErrorPage(erro, d))
                    })
                }

                // GET /periodos --------------------------------------------------------------------
                else if(req.url == '/periodos'){
                    axios.get('http://localhost:3000/periodos')
                    .then( resposta => {
                        res.writeHead(200, {'Content-Type' : 'text/html'})
                        res.end(templates2.periodosListPage(resposta.data, d))
                    }).catch( erro => {
                        res.writeHead(522, {'Content-Type' : 'text/html'})
                        res.end(templates2.periodosErrorPage(erro, d))
                    })
                }

                // GET /periodos/id --------------------------------------------------------------------
                else if(/\/periodos\/\d+$/.test(req.url)){
                    axios.get('http://localhost:3000' + req.url)
                    .then( resposta => {
                        res.writeHead(200, {'Content-Type' : 'text/html'})
                        res.end(templates2.periodoPage(resposta.data, d))
                    }).catch( erro => {
                        res.writeHead(523, {'Content-Type' : 'text/html'})
                        res.end(templates2.periodoPage(erro, d))
                    })
                }
                
                // GET /periodos/register --------------------------------------------------------------------
                else if(req.url == '/periodos/register'){
                    console.log("entrei no get register de periodos")
                    res.writeHead(200, {'Content-Type' : 'text/html'})
                    res.end(templates2.periodoFormPage(d))
                }
                
                // GET /periodos/edit/:id --------------------------------------------------------------------
                else if(/\/periodos\/edit\/\d+$/.test(req.url)){
                    let pieces = req.url.split('/')

                    let idPeriodo = pieces[pieces.length - 1]

                    axios.get('http://localhost:3000/periodos/' + idPeriodo)
                    .then( periodosResposta => {
                        res.writeHead(200, {'Content-Type' : 'text/html'})
                        res.end(templates2.periodoFormEditPage(periodosResposta.data,d))

                    }).catch( erro => {
                        res.writeHead(521, {'Content-Type' : 'text/html'})
                        res.end(templates2.periodosErrorPage(erro, d))
                    })
                }

                // GET /periodos/delete/:id --------------------------------------------------------------------
                else if(/\/periodos\/delete\/\d+$/.test(req.url)){
                    let pieces = req.url.split('/')

                    let idPeriodo = pieces[pieces.length - 1]

                    axios.delete('http://localhost:3000/periodos/' + idPeriodo)
                    .then( resposta => {
                        res.writeHead(200, {'Content-Type' : 'text/html'})
                        res.end(templates2.periodoPage(resposta.data, d))
                    }).catch( erro => {
                        res.writeHead(521, {'Content-Type' : 'text/html'})
                        res.end(templates2.periodosErrorPage(erro, d))
                    })
                }

                // GET ? -> Lancar um erro
                else {
                    res.writeHead(404, {'Content-Type' : 'text/html'})
                    res.end(templates.compositoresErrorPage(`Pedido GET não suportado: ${req.url}`, d))
                }
                break
            
            case "POST":
                // POST /compositores/registo --------------------------------------------------------------------
                if(req.url == '/compositores/register'){
                    collectRequestBodyData(req, result => {
                        if(result){
                            //Transformar tuple stringified de período de volta para array, para empurrar para o json server
                            const periodoTuple = JSON.parse(result.periodo)
                            result.periodo = periodoTuple;
                            
                            axios.post('http://localhost:3000/compositores', result)
                            .then( resposta => {
                                res.writeHead(201, {'Content-Type' : 'text/html'})
                                res.end(templates.compositorPage(resposta.data, d))
                            })
                            .catch( erro => {
                                res.writeHead(520, {'Content-Type' : 'text/html'})
                                res.end(templates.compositoresErrorPage(erro, d))
                            })
                        } else {
                            res.writeHead(404, {'Content-Type' : 'text/html'})
                            res.end(templates.compositoresErrorPage("Unable to collect the needed data.", d))
                        }

                    })
                }
                
                // POST /compositores/edit/:id --------------------------------------------------------------------
                else if(/\/compositores\/edit\/C[0-9]+$/.test(req.url)){
                    collectRequestBodyData(req, result => {
                        if(result){
                            let pieces = req.url.split('/')

                            let idCompositor = pieces[pieces.length - 1]

                            axios.put('http://localhost:3000/compositores/' + idCompositor, result)
                            .then( resposta => {
                                res.writeHead(201, {'Content-Type' : 'text/html'})
                                res.end(templates.compositorPage(resposta.data, d))
                            })
                            .catch( erro => {
                                res.writeHead(520, {'Content-Type' : 'text/html'})
                                res.end(templates.compositoresErrorPage(erro, d))
                            })
                        } else {
                            res.writeHead(404, {'Content-Type' : 'text/html'})
                            res.end(templates.compositoresErrorPage("Unable to collect the needed data.", d))
                        }

                    })
                }
                // POST /periodos/registo --------------------------------------------------------------------
                else if(req.url == '/periodos/register'){
                    console.log("entrei no post register")
                    collectRequestBodyData(req, result => {
                        if(result){
                            axios.post('http://localhost:3000/periodos', result)
                            .then( resposta => {
                                res.writeHead(201, {'Content-Type' : 'text/html'})
                                res.end(templates2.periodoPage(resposta.data, d))
                            })
                            .catch( erro => {
                                res.writeHead(520, {'Content-Type' : 'text/html'})
                                res.end(templates2.periodosErrorPage(erro, d))
                            })
                        } else {
                            res.writeHead(404, {'Content-Type' : 'text/html'})
                            res.end(templates2.periodosErrorPage("Unable to collect the needed data.", d))
                        }

                    })
                }

                // POST /periodos/edit/:id --------------------------------------------------------------------
                else if(/\/periodos\/edit\/\d+$/.test(req.url)){
                    collectRequestBodyData(req, result => {
                        if(result){
                            let pieces = req.url.split('/')

                            let idPeriodo = pieces[pieces.length - 1]

                            axios.put('http://localhost:3000/periodos/' + idPeriodo, result)
                            .then( resposta => {
                                res.writeHead(201, {'Content-Type' : 'text/html'})
                                res.end(templates2.periodoPage(resposta.data, d))
                            })
                            .catch( erro => {
                                res.writeHead(520, {'Content-Type' : 'text/html'})
                                res.end(templates2.periodosErrorPage(erro, d))
                            })
                        } else {
                            res.writeHead(404, {'Content-Type' : 'text/html'})
                            res.end(templates2.periodosErrorPage("Unable to collect the needed data.", d))
                        }

                    })
                }
                // POST ? -> Lancar um erro
                else {
                    res.writeHead(404, {'Content-Type' : 'text/html'})
                    res.end(templates.compositoresErrorPage(`Pedido POST não suportado: ${req.url}`, d))
                }
            default: 
                // Outros metodos nao sao suportados
        }
    }
})

compositoresServer.listen(7777, ()=>{
    console.log("Servidor à escuta na porta 7777...")
})



