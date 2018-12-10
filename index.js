const express = require('express')
const path = require('path');
const app = express()
const port = 3000
const routes = require('./routes')
const bodyParser = require('body-parser')

app.use('/style', express.static(path.join(__dirname, '/style')))
app.use('/scripts', express.static(path.join(__dirname, '/scripts')))


app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, './index.html'))
});

app.use((err, req, res, next) => {
  console.error(err, err.stack)
  res.status(500).send(err);
})

app.listen(port, () => console.log(`Listening on port ${port}!`))




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

