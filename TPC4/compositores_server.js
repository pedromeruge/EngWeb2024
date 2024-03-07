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
                    .then( respostaCompositores => {
                        var compositor = respostaCompositores.data
                        axios.get('http://localhost:3000/periodos')
                            .then(respostaPeriodos => {

                                const todosPeriodos = respostaPeriodos.data;
                                const periodoToUpdate = todosPeriodos.find( p => p.id === compositor.periodo[0])

                                if (periodoToUpdate) {
                                    periodoToUpdate.compositores = periodoToUpdate.compositores.filter( c => c[0] !== compositor.id)

                                    axios.put(`http://localhost:3000/periodos/${periodoToUpdate.id}`,periodoToUpdate)
                                    . then(() => {
                                        res.writeHead(201, {'Content-Type' : 'text/html'})
                                        res.end(templates.compositorPage(compositor, d))
                                    })
                                    .catch(error => {
                                        res.writeHead(521, { 'Content-Type': 'text/html' });
                                        res.end(templates.compositoresErrorPage("Error updating periodo in the database", d));
                                    });
                                } else {
                                    res.writeHead(404, { 'Content-Type': 'text/html' });
                                    res.end(templates.compositoresErrorPage("Periodo not found in the database", d));
                                }
                            })
                            .catch(erro => {
                                res.writeHead(522, {'Content-Type' : 'text/html'})
                                res.end(templates.compositoresErrorPage(erro, d))
                            })
                        .catch( erro => {
                            res.writeHead(523, {'Content-Type' : 'text/html'})
                            res.end(templates.compositoresErrorPage(erro, d))
                        })
                    }).catch( erro => {
                        res.writeHead(524, {'Content-Type' : 'text/html'})
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
                    axios.get('http://localhost:3000/periodos/' + idPeriodo)
                    .then( respostaPeriodo => {
                        if (respostaPeriodo.data.compositores.length === 0) {
                            axios.delete('http://localhost:3000/periodos/' + idPeriodo)
                            .then( respostaDelete => {
                                res.writeHead(200, {'Content-Type' : 'text/html'})
                                res.end(templates2.periodoPage(respostaDelete.data, d))
                            }).catch( erro => {
                                res.writeHead(521, {'Content-Type' : 'text/html'})
                                res.end(templates2.periodosErrorPage(erro, d))
                            })
                        } else {
                            res.writeHead(521, {'Content-Type' : 'text/html'})
                            res.end(templates2.periodosErrorPage("Remover todos os compositores do periodo, para poder realizar esta operação", d))
                        }
                    }).catch( erro => {
                        res.writeHead(521, {'Content-Type' : 'text/html'})
                        res.end(templates2.periodosErrorPage("Erro a encontrar o periodo na database", d))
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
                            .then( respostaCompositores => {

                                axios.get('http://localhost:3000/periodos')
                                    .then(respostaPeriodos => {

                                        const todosPeriodos = respostaPeriodos.data;
                                        const periodoToUpdate = todosPeriodos.find( p => p.id === result.periodo[0])

                                        if (periodoToUpdate) {
                                            periodoToUpdate.compositores.push([result.id,result.nome]) // acrescentar novo compositor à lista de compositores desse período
                                        
                                            axios.put(`http://localhost:3000/periodos/${periodoToUpdate.id}`,periodoToUpdate)
                                            . then(() => {
                                                res.writeHead(201, {'Content-Type' : 'text/html'})
                                                res.end(templates.compositorPage(respostaCompositores.data, d))
                                            })
                                            .catch(error => {
                                                res.writeHead(520, { 'Content-Type': 'text/html' });
                                                res.end(templates.compositoresErrorPage("Error updating periodo in the database", d));
                                            });
                                        } else {
                                            res.writeHead(404, { 'Content-Type': 'text/html' });
                                            res.end(templates.compositoresErrorPage("Periodo not found in the database", d));
                                        }
                                    })
                                .catch(erro => {
                                    res.writeHead(520, {'Content-Type' : 'text/html'})
                                    res.end(templates.compositoresErrorPage(erro, d))
                                })
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

                            const novoPeriodoTuple = JSON.parse(result.periodo)
                            result.periodo = novoPeriodoTuple;

                            const periodoPrevioTuple = JSON.parse(result.periodoInicial) // aceder a periodo antes da alteração
                            delete result.periodoInicial

                            axios.put('http://localhost:3000/compositores/' + idCompositor, result)
                            .then( respostaCompositores => {

                                if (result.periodo != result.periodoInicial) { // se utilizador mudou de período, atualizar as respetivas listas dos períodos
                                    
                                    axios.get('http://localhost:3000/periodos')
                                    .then(respostaPeriodos => {

                                        const todosPeriodos = respostaPeriodos.data;
                                        const novoPeriodo = todosPeriodos.find( p => p.id === novoPeriodoTuple[0])
                                        const  previoPeriodo = todosPeriodos.find( p => p.id === periodoPrevioTuple[0])

                                        if (novoPeriodo && previoPeriodo) {
                                            novoPeriodo.compositores.push([result.id,result.nome]) // acrescentar novo compositor à lista de compositores desse período
                                            previoPeriodo.compositores = previoPeriodo.compositores.filter( c => c[0] !== idCompositor)

                                            axios.put(`http://localhost:3000/periodos/${novoPeriodo.id}`,novoPeriodo) // atualizar periodo antigo
                                            . then(() => {
                                                axios.put(`http://localhost:3000/periodos/${previoPeriodo.id}`,previoPeriodo) //atualizar periodo novo
                                                    . then(() => {
                                                        res.writeHead(201, {'Content-Type' : 'text/html'})
                                                        res.end(templates.compositorPage(respostaCompositores.data, d))
                                                
                                                    })
                                                    .catch(error => {
                                                        res.writeHead(520, { 'Content-Type': 'text/html' });
                                                        res.end(templates.compositoresErrorPage("Error updating prev periodo in the database", d));
                                                    });                                  
                                            })
                                            .catch(error => {
                                                res.writeHead(520, { 'Content-Type': 'text/html' });
                                                res.end(templates.compositoresErrorPage("Error updating novo periodo in the database", d));
                                            })
                                        } else {
                                            res.writeHead(404, { 'Content-Type': 'text/html' });
                                            res.end(templates.compositoresErrorPage("Periodo not found in the database", d));
                                        }
                                    })
                                }
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
                    collectRequestBodyData(req, result => {
                        if(result){
                            result.compositores = []
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
                        console.log("Entrei no POST edit periodos")
                        if(result){
                            let pieces = req.url.split('/')

                            let idPeriodo = pieces[pieces.length - 1]
                            console.log("Entrei no POST edit periodos 2")
                            axios.patch('http://localhost:3000/periodos/' + idPeriodo, result)
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



