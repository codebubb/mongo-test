var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const MongoClient = require('mongodb').MongoClient;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ObjectID = require('mongodb').ObjectID;
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

MongoClient.connect('mongodb://localhost:27017/test', (err, client) => {
  if (err) throw err;
  const db = client.db('test');
  const users = db.collection('users');
  app.locals.users = users; 
});




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  {
    passReqToCallback: true
  },
  (req, username, password, authCheckdone) => {
    app.locals.users
      .findOne({ username })
      .then(user => {
        if (!user) {
          return authCheckdone(null, false, req.flash('error', 'No User found'));
        } 
        if (user.password !== password) { 
          return authCheckdone(null, false, req.flash('error', 'Password not right'));
        } 
        return authCheckdone(null, user);
        
      })
      .catch(err => authCheckdone(err, false, req.flash('error', 'Something went wrong')));
  })
);

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  done(null, { id })
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
