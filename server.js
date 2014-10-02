/**
 * Created by raul on 02/10/2014.
 */


//Elenca dependencias
//var path = require('path');
//var favicon = require('static-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');


var express = require('express'), //Express framework
  middleware = require('./infra/middleware'),
  router = require('./infra/router'),
  passport = require('passport')
  ;




//Create express server.
var app = express();
var conf = require('./infra/conf').get(app.settings.env); //Objeto de configuração... varias entradas, baseada no process.env.NODE_ENV (PROD, DEV, etc.)


//  require('./infra/passportconf')(passport); // pass passport for configuration

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


//Configur  a "middleware"
middleware.setup(app, conf, passport);
router.run(app, conf, passport);



//Inicia servidor.
app.listen(conf.server.port);

if (app.settings.env == conf.validEnvs.dev) {
  console.log('app.env: ' + app.settings.env)
  console.log('process.env.NODE_ENV: ' + process.env.NODE_ENV);
}

console.log('I stand ready for subjugation (on port ' + conf.server.port + '), my master.');

