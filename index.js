const express = require('express');
const path = require('path');
const favicon = require('static-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');

const { store, actions } = require('./app/src/redux/state');
const Query = require('./app/src/redux/view/query');

const routes = require('./routes/index');
const users = require('./routes/users');
const query = require('./app/src/routes/album/query');
const search = require('./app/src/routes/album/search');
const spotify = require('./app/src/routes/album/spotify');

const SpotifyWrapper = require('./app/src/api/spotify');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* App locals setup */

app.locals.searchAlbum = require('./app/src/locals/search-album');

app.locals.Query = Query;
app.locals.store = store;
app.locals.actions = actions;
app.locals.spotify = SpotifyWrapper(SpotifyWebApi);

app.use('/', routes);
app.use('/users', users);
app.use('/data/album', spotify);
app.use('/data/album', search);
app.use('/data/album', query);

// / catch 404 and forwarding to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// / error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

module.exports = app;
