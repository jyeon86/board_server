var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//npm install express-session --save
var session = require('express-session');
//end of session part
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var readRouter = require('./routes/read');
var writeRouter = require('./routes/write');
var updateRouter = require('./routes/update');
var searchRouter = require('./routes/search');
var show_membersRouter = require('./routes/show_members');
var publicRouter = require('./routes/public');
var joinRouter = require('./routes/join');
var deleteRouter = require('./routes/delete');
var loginRouter = require('./routes/login');
//var logoutRouter = require('./routes/logout');왜작동안돼


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret : 'my key', resave : true, saveUninitialized :true}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/read', readRouter);
app.use('/write', writeRouter);
app.use('/update', updateRouter);
app.use('/search', searchRouter);
app.use('/show_members', show_membersRouter);
app.use('/public', publicRouter);
app.use('/join', joinRouter);
app.use('/delete', deleteRouter);
app.use('/login', loginRouter);
//app.use('/logout', logoutRouter);왜작동안돼
//app.use('/join', joinRouter);
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
  res.render('error');
});

module.exports = app;
