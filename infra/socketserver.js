/**
 * Created by raul on 10/14/14.
 */
'use strict';
exports.setup = function setup(conf, server) {

    var session = conf.session;
    var cookieParser = conf.cookieParser;
    var io = require('socket.io').listen(server);


    //Configure authentication "middleware" for io.socket.
    //This middleware uses default passport configs, so it checks for user in session.passport.user property!
    io.use(function(socket, ioNext) {
        //socket.handshake = request.
        // var req = socket.handshake;
        // var res = {}; 
        var req = socket.request;
        var res = socket.request.res;
        console.log('Inside socket-io middleware. Going to look for user..');

        cookieParser(req, res, function(err) {
            //if error, call ios next.
            if (err) {
                return ioNext(err);
            }
            session(req, res, function(err) {
                //If no user, then throw error
                if (!req.session || !req.session.passport || !req.session.passport.user) {
                    console.log('Rejecting socket connection because of lack of user session.');
                    err = new Error('No user session!');
                }
                ioNext(err);
            });
        });
    });


    //Do connection.
    io.on('connection', function(socket) {
        console.log('There was a connection...');
        socket.emit('news', {
            texto: 'world'
        });
        socket.on('otherTestEvent', function(data) {
            console.log(data);
        });

        var sockReq = socket.request;
        // var sockClient = socket.client;

        var session = sockReq.session;
        // var session = sockClient ? sockClient.request.session : undefined;

        var user = session.passport.user;
        console.log('loged in user: ' + JSON.stringify(user));

        socket.on('chat', function(data, cb) {
            console.log('chat recieved: ' + data);
            cb({
                message: 'ack',
                texto: 'Ackknoleged: ' + data
            });
        });
    });
    // io.on('connection', function(socket) {
    //     console.log('user connected');
    //     // socket.emit('news')
    // });

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
