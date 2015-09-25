/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
/*
// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
var CasStrategy = require('passport-cas-strategy').Strategy;
*/
var config = require('./environment');

module.exports = function(app) {
  var env = app.get('env');

  app.set('views', config.root + '/server/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());

  /*
  //PassPort implementation - https://github.com/egor-manjula/passport-cas-strategy/blob/master/example/app.js

  app.use(expressSession({secret: 'xu4bb9i-o(c**u=s@w!!$bju*1*c5m*z9p3!j&@cng=$k!+e12'}));


  passport.use(new CasStrategy({
      postRedirect  : true,
      casServiceUrl : 'https://weblogin.asu.edu/cas', // "https://10.49.128.21:8443/cas/login"
      serviceBaseUrl: 'https://discovery.a2c2.asu.edu',
      validateMethod: 'serviceValidate', // ['validate', 'proxyValidate', 'serviceValidate']
      passReqToCallback: false
    }, function(req, data, done) {
      var user = {'email': data.user};
      console.log(user);
      return done(null, user, data);
    }
  ));

  var users = {};
  passport.serializeUser(function(user, done) {
    users[user.id] = user;
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, users[user.id]);
  });

  app.use(passport.initialize());
  app.use(passport.session());

  */

  if ('production' === env) {
    //app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('appPath', config.root + '/public');
    app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', 'client');
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};
