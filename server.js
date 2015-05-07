/**
 * Created by raul on 02/10/2014.
 */

'use strict';
var express = require('express'), //Express framework
  middleware = require('./infra/middleware'),
  iosocketserver = require('./infra/socketserver'),

  router = require('./infra/router'),
  passport = require('passport')
  ;




//Create express server.
var app = express();
var conf = require('./config/conf').get(app.settings.env); //Objeto de configuração... varias entradas, baseada no process.env.NODE_ENV (PROD, DEV, etc.)
var authenticationUtil = require('./infra/authenticationUtil')(conf);
var models = require('./models')(conf); //ORM will be needed for passport 
var zidecoUtils = require('./infra/zidecoUtils');

app.set('authenticationUtil', authenticationUtil);
app.set('conf', conf);
app.set('ormmodels', models);
app.set('zUtils', zidecoUtils);

require('./infra/passportconf')(passport, models); // pass passport for configuration


///// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//});

/// error handlers
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err.stack);
});

//// production error handler
//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//        message: err.message,
//        error: {}
//    });
//});

//Inicia servidor.
var http = require('http');
var server = http.createServer(app);

//Configure connect 'middleware' (session, etc.)
middleware.setup(app, conf, passport);



//configure and run socket.io server
// iosocketserver.setup(conf, server);

//Configure routes
router.run(app, conf, passport);



//models.sequelize.sync().success(function () {


//});



//models.sequelize.sync().success(function () {
//Comeca a escutar
  server.listen(conf.server.port, function(){
    if (app.settings.env === conf.validEnvs.dev) {
      console.log('app.env: ' + app.settings.env);
      console.log('process.env.NODE_ENV: ' + process.env.NODE_ENV);
    }

    console.log('I stand ready for subjugation (on port ' + conf.server.port + '), my master.');
  });
//});









