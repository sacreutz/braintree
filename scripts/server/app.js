const express = require('express')
const path = require('path')
const routes = require('./routes')
const bodyParser = require('body-parser')

const app = express()

app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  var err = new Error('Not Found');

  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) { // eslint-disable-line no-unused-vars
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function (err, req, res, next) { // eslint-disable-line no-unused-vars
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;


