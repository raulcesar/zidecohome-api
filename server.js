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
  passport = require('passport'),
  cookieParser = require('cookie-parser');
  ;




//Create express server.
var app = express();
var conf = require('./infra/conf').get(app.settings.env); //Objeto de configuração... varias entradas, baseada no process.env.NODE_ENV (PROD, DEV, etc.)


require('./infra/passportconf')(passport); // pass passport for configuration

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

//TODO: Later we will see if this is really the best place
var io = require('socket.io').listen(server);
//var cookieParser = require('cookie-parser')();

//var session = require('./session')({ secret: 'secret' });
var session = require('express-session')
  , sessionStore = new session.MemoryStore();

session = session({
  store: sessionStore,
  secret: conf.application.sessionsecret,
  resave: true,
  saveUninitialized: true
});
var cookieParser = require('cookie-parser')();

var passportSocketIo = require("passport.socketio");

app.use(cookieParser);
app.use(session);


//Configur  a "middleware"

middleware.setup(app, conf, passport);
router.run(app, conf, passport, io);


//TODO: Changed the listen from directly on app to http...
//var io = require('socket.io')(app);
//app.listen(conf.server.port);



//var http = require('http').Server(app);

//
////TODO: Just playing for now. Later we will see if this is really the best place

//function tick () {
//  var now = new Date().toUTCString();
//  console.log('tick...');
//  io.sockets.emit('news', now);
//}
//setInterval(tick, 10000);


//Process session in middleware to give socket.io access to session.
io.use(function(socket, ioNext) {
  //socket.handshake = request.
  var req = socket.handshake;
  var res = {};
  cookieParser(req, res, function(err) {
    //if error, call ios next.
    if (err) return ioNext(err);
    session(req, res, function(err) {
      //If no user, then throw error
      var err = err;
      if (!req.session || !req.session.passport || !req.session.passport.user) {
        err = new Error('No user session!');
      }

      //If all is well, just call next.
      ioNext(err);
    });
  });
});

//Just a check for connection. Will probably do something here, like store user.
io.on('connection', function (socket) {
  console.log('There was a connection...');
  socket.emit('news', {texto: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });

  var session = socket.handshake.session;
  var user = session.passport.user;

  console.log('user: ' + JSON.stringify(user));

  socket.on('chat', function (data, cb) {
    console.log('chat recieved: ' + data);
    cb({message: 'ack', texto: 'Ackknoleged: ' + data});
  });
});


server.listen(conf.server.port, function(){
  if (app.settings.env == conf.validEnvs.dev) {
    console.log('app.env: ' + app.settings.env);
    console.log('process.env.NODE_ENV: ' + process.env.NODE_ENV);
  }

  console.log('I stand ready for subjugation (on port ' + conf.server.port + '), my master.');
});






