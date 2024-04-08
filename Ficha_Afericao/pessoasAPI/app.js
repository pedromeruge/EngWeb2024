var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose')

var mongoDB = 'mongodb://127.0.0.1/pessoas'
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
var db = mongoose.connection

db.on('error', console.error.bind(console, "erro de conexão ao MongoDB")) // se falhar ao ligar à base de dados

db.once('open', () => { // se ligar à base de daods corretamente
  console.log("Conexão ao MongoDB realizada com sucesso")
})

 // definir rotas para cada coleção
var pessoasRouter = require('./routes/pessoas');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', pessoasRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err)
  res.jsonp(JSON.stringify(err));
});

module.exports = app;
