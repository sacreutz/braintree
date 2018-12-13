const express = require('express')
const path = require('path');
const app = express()
const port = 3000
const routes = require('./scripts/server/routes')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
//app.listen(port, () => console.log(`Listening on port ${port}!`))

app.use('/style', express.static(path.join(__dirname, '/style')))
app.use('/scripts', express.static(path.join(__dirname, '/scripts')))
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash())
app.use('/', routes)


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs')
app.use(express.json());
app.use(express.urlencoded({extended: false}));


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

