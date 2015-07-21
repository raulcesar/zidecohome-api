'use strict';


var net = require('net');


//TODO: Create setup function for use inside "server.js"
// var HOST = 'localhost';
// var PORT = 3033;


// conf.server.port


exports.setup = function setup(conf, server) {

    // var session = conf.session;
    // var cookieParser = conf.cookieParser;
    var io = require('socket.io').listen(server);

var server = net.createServer(function(socket) { //'connection' listener
  console.log('client connected');
  socket.on('end', function() {
    console.log('client disconnected');
  });
  socket.on('data', function(data) {
  	console.log('client sent: ' + data);
  	socket.write('echo: ' + data);
  });
  
  socket.pipe(socket);
});


server.listen(PORT, HOST, function() { //'listening' listener
  console.log('server bound');
});



    //hydrate configure with io object
    conf.io = io;

};





