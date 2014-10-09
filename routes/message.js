/**
 * Created by raul on 10/9/14.
 */
var conexaoMysql = require('../infra/mysqlConectionHelper');



function handleGet(connection, req, res, opts) {
  var io = opts.io;
  io.sockets.emit('news', 'yeahhhh babbyyy');
  res.send({autenticacao: 'ok'});
}

//Return API
//module.exports = {
//  version: '1.0',
//  get: function (req, res) {
//    conexaoMysql.resolveConection(handleGet, req, res);
//  }
//};


module.exports = function(io) {
  var routes = {};

  routes.get = function (req, res) {
    conexaoMysql.resolveConection(handleGet, req, res, {io: io});
  };

  return routes;
};
