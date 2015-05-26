'use strict';
/**
 * Created by raul on 10/9/14.
 */



function handleGet(req, res) {
  var io = req.io;
  console.log('emitting event news');
  io.sockets.emit('news', 'yeahhhh babbyyy');
  res.send({autenticacao: 'ok'});
}


//Return API
module.exports = {
    get: handleGet
};
