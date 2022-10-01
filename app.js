//----------------------------------------------------------------------------------------------------------------------

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const Sequelize = require('sequelize');
const config = require(__dirname + '/config/config.json')["development"];

const indexRouter = require('./routes/index');
const passRouter = require('./routes/password');
const logInRouter = require('./routes/logIn');
const registerRouter = require('./routes/registeration');
const ApiRouter = require('./routes/nasaAPI');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


let sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

// initalize sequelize with session store
let SequelizeStore = require('connect-session-sequelize')(session.Store);
let myStore = new SequelizeStore({
  db: sequelize
});

app.use(session({
  secret:"keyboard cat",
  resave: true,
  store:myStore,
  saveUninitialized: false,
  cookie: {secure: false, maxAge: 1000 * 60 * 60 }
}));
myStore.sync();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/', registerRouter);
app.use('/', logInRouter);
app.use('/', passRouter);
app.use('/', ApiRouter);

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
  res.render('errorPage');
});

module.exports = app;