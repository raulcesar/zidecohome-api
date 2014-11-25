/**
 * Created by raul on 10/20/14.
 */
//var models  = require('../models');

function handleGet(connection, req, res) {
  var sql = 'select col1, col2 from table1';
  var pars = undefined;
  connection.query(sql, pars, function (err, rows) {
    if (err) {
      conexaoMysql.logAndRespond(err, res);
      return;
    }
    if (rows.length === 0) {
      res.send(204);
    } else {

      //Criamos os objetos hierarquizados.
//            rows = pessoaTransformFunction(rows);

      res.send(rows);
    }

    connection.release();
  });
}

function handleFind(connection, req, res) {
  res.send(rows[0]);
}

function handleIns(connection, req, res) {
  res.statusCode = 201;
  res.send({id: 1, nome: 'teste'});

}
function handleUpd(connection, req, res) {
  res.statusCode = 200;
  res.send({id: 1, nome: 'teste'});

}

function handleDel(connection, req, res) {
  res.send({
    result: 'success',
    err: '',
    id: req.params.id
  });

}

//
//function criaCallbacksCustomizados(app, validaAutenticacao) {
//  var callbacks = [];
//  if (validaAutenticacao) {
//    callbacks[0] = validaAutenticacao;
//  }
//  callbacks.push(buscaDependentes);
//
////    app.get('/auth/google', passport.authenticate('google'));
//  //Exemplo de um callback customizado. No caso um "subrecurso"
//
//  app.get('/auth/:provider/:status', callbacks);
//}
//
//Return API
module.exports = {
    version: '1.0',
      get :
    function (req, res) {
//      var teste =req.ormmodels.Currency
      //Get currency and change description (POC)
      req.ormmodels.Currency.find(1).success(function(currency) {
        currency.name = 'testeDollar';
        currency.save();
        res.send(currency);
      })
//      req.ormmodels.Currency.create({ name: 'Dollar'}).success(function(currency) {
//        // you can now access the newly created task via the variable task
//        res.send(currency);
//
//      })

//      req.ormmodels.Currency.findAll().success(function (currencies) {
//        res.send(currencies);
//      });
//    conexaoMysql.resolveConection(handleGet, req, res);
    }

  ,
    find: function (req, res) {
      console.log('TODO: not yet implemented');
//    conexaoMysql.resolveConection(handleFind, req, res);
    }
  ,
    ins: function (req, res) {
      console.log('TODO: not yet implemented');
//    conexaoMysql.resolveConection(handleIns, req, res);
    }
  ,
    upd: function (req, res) {
      console.log('TODO: not yet implemented');
//    conexaoMysql.resolveConection(handleUpd, req, res);
    }
  ,
    del: function (req, res) {
      console.log('TODO: not yet implemented');
//    conexaoMysql.resolveConection(handleDel, req, res);
    }
//    ,
//    customcallbacks: criaCallbacksCustomizados
};



