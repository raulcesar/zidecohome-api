/**
 * Created by raul on 4/28/14.
 *
 * Recurso que representa um RESUMO de pessoas.
 * Resolvi criar isso como um recurso separado e unico, ao invés de usar a rota de PESSOAS para servir ora pessoas
 * completas e hora pessoas "resumidas".
 *
 * Contudo, este recurso NÃO suporta todos os métodos. Apenas o GET e FIND.
 *
 */
"use strict";

var conexaoMysql = require("../infra/mysqlConectionHelper");

var rows = [
    {
        ID: 1,
        description: "Bla Bla Bla"
    },
    {
        ID: 2,
        description: "Bla Bla foo"
    }
];

function handleGet(connection, req, res) {
    var sql = "select col1, col2 from table1";
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
//  connection.query("INSERT INTO " + tabName + " SET ?", req.body, function (err, result) {
//    if (err){ conexaoMysql.logaEResponde(err,res); return; }
//    res.statusCode = 201;
//    res.send({
//      result: "success",
//      err:    "",
//      id:     result.insertId
//    });
//    connection.release();
//  });
    res.statusCode = 201;
    res.send({id: 1, nome: "teste"});

}
function handleUpd(connection, req, res) {
//    //Aqui, temos que
//    var pessoa = pessoaModel.pessoaTabelize(req.body);
//
//    connection.query("UPDATE " + tabName + " SET ? WHERE id=" + req.params.id, pessoa, function (err) {
//        if (err) {
//            conexaoMysql.logaEResponde(err, res);
//            return;
//        }
//
//        res.statusCode = 200;
//        res.send();
//    });
//    connection.release();
    res.statusCode = 200;
    res.send({id: 1, nome: "teste"});

}

function handleDel(connection, req, res) {
//    connection.query("DELETE FROM " + tabName + " WHERE idCadastro = ?", req.params.id,
//        function (err) {
//            if (err) {
//                connection.release();
//                conexaoMysql.logaEResponde(err, res);
//                return;
//            }
//            res.send({
//                result: "success",
//                err: "",
//                id: req.params.id
//            });
//            connection.release();
//        });
    res.send({
        result: "success",
        err: "",
        id: req.params.id
    });

}


function buscaDependentes(req, res) {
    res.send({autenticacao: "ok"});
}


function criaCallbacksCustomizados(app, validaAutenticacao) {
    var callbacks = [];
    if (validaAutenticacao) {
        callbacks[0] = validaAutenticacao;
    }
    callbacks.push(buscaDependentes);

//    app.get("/auth/google", passport.authenticate("google"));
    //Exemplo de um callback customizado. No caso um "subrecurso"

    app.get("/auth/:provider/:status", callbacks);
}

//Return API
module.exports = {
    version: "1.0",
    get: function (req, res) {
        conexaoMysql.resolveConection(handleGet, req, res);
    },
    find: function (req, res) {
        conexaoMysql.resolveConection(handleFind, req, res);
    },
    ins: function (req, res) {
        conexaoMysql.resolveConection(handleIns, req, res);
    },
    upd: function (req, res) {
        conexaoMysql.resolveConection(handleUpd, req, res);
    },
    del: function (req, res) {
        conexaoMysql.resolveConection(handleDel, req, res);
    }
//    ,
//    customcallbacks: criaCallbacksCustomizados
};



