/**
 * Created by raul on 10/14/14.
 */
exports.setup = function setup(conf, server) {

  var session = conf.session;
  var cookieParser = conf.cookieParser;
  var io = require('socket.io').listen(server);

  //Configure authentication "middleware" for io.socket.
  //This middleware uses default passport configs, so it checks for user in session.passport.user property!
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
          console.log('Rejecting socket connection because of lack of user session.');
          err = new Error('No user session!');
        }
        ioNext(err);
      });
    });
  });


  //Do connection.
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

  ////TODO: Just playing for now. Later we will see if this is really the best place

//function tick () {
//  var now = new Date().toUTCString();
//  console.log('tick...');
//  io.sockets.emit('news', now);
//}
//setInterval(tick, 10000);

  //hydrate configure with io object
  conf.io = io;

};