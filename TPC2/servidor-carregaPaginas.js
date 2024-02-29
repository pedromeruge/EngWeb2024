var http = require('http')
var fs = require('fs')
var url = require('url')

http.createServer(function(req,res) {
    var regex = /^\/(c\d+)$/ // o ^ indica o início da string, o \/ representa o carctér "/" espaced, porque "/" é um caractér especial
    var q = url.parse(req.url,true)
    var matchResult = q.pathname.match(regex);

    if (q.pathname === "/") {
        // Handle requests to the root path "/"
        fs.readFile("cidadesSite/index.html", function(err, dados) {
            res.writeHead(200, {'Content-Type':'text/html'});
            res.write(dados)
            res.end()
        });
    }
    else if (matchResult && parseInt(matchResult[1].substring(1)) <= 100) {
        console.log("Entered parse page")
        fs.readFile("cidadesSite/" + q.pathname.substring(1) + ".html",function(err,dados) {
            res.writeHead(200, {'Content-Type':'text/html'})
            res.write(dados)
            res.end()
        })
    }
    else if (q.pathname == "/w3.css") {
        fs.readFile("cidadesSite/w3.css",function(err,dados) {
            res.writeHead(200, {'Content-Type':'text/css'})
            res.write(dados)
            res.end()
        })
    }
    else {
        res.writeHead(400, {'Content-type':'text/html'})
        res.write("<p>Erro: Pedido nao suportado.</p>")
        res.write("<pre> Received: " + q.pathname + "</pre>")
        res.end()
    }
    console.log(q.pathname)

}).listen(7777)