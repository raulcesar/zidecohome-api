'use strict';
// var ldapQuerier = require('../model/ldapQuerier');
var _ = require('lodash');
// var modelHistoricoPerfil = require('../model/kdusuarioHistoricoPerfilModel');
// var queriesHistoricoPerfil = require('../model/kdusuarioHistoricoPerfilQueryMontador');

// var modelUsuario = require('../model/kdUsuarioModel');
// var queriesUsuario = require('../model/kdUsuarioQueryMontador');
// var kdutils = require('./kdutils');
// var moment = require('moment');
var PhaseController = require('./PhaseController');
var crypto = require('crypto');
var validator = require('validator');

var conf;



// MIDDLEWARE that checks if user is loged in
  // function validateAuthentication(req, res, next) {
  //   // if user is authenticated in the session, carry on
  //   if (req.isAuthenticated()) {
  //     return next();
  //   }

  //   // Se não estiver logado, joga para a pagina de login do GOOGLE... POSSIVELMENTE vou jogar para uma pagina de login do aplicativo.
  //   var referer = req.originalUrl;

  //   res.redirect(conf.application.apiroute + '/logingoogle' + '?referer=' + referer);
  // }
  function getReferer(req) {
    return req.param('referer') || req.header('referer') || 'http://localhost:9000';
  }


function validateAuthentication(req, res, next) {
    var userIsValid = false;
    //1 check if there is a user in session.
    if (req.isAuthenticated()) {
        var user = req.user;
        if (!user.isValid()) {
            return next('User invalid!');
        }


        //user authenticated and valid
        var invalidUsers = req.app.get('invalidUsers');
        if (_.isUndefined(invalidUsers)) {
            userIsValid = true;
        } else {
            var userKey = req.user.hidratedUser.id.toString();
            var invalidUser = invalidUsers[userKey];
            if (_.isUndefined(invalidUser)) {
                userIsValid = true;
            } else {
                //Since we are "revalidating the user", remove from invalid users.
                invalidUsers[userKey] = undefined;
            }
        }
    }



    //2 se constar, verificamos se ele está na lista de "invalidos"

    //3 efetua logout e elimina da lista (deste servidor)


    // if user is authenticated in the session, carry on
    if (userIsValid === true) {
        return next();
    }


    // If not loged on, go to login page.
    // var referer = req.originalUrl;
    var antigo = req.originalUrl;
    console.log('antigamente, mandava o /logingoogle o referer: ' + antigo);
    var referer = getReferer(req);
    res.redirect(conf.application.apiroute + '/logingoogle' + '?referer=' + referer);

    // res.redirect(conf.application.apiroute + '/validacas');
}

/**
 * Invalidates loged in user, forcing a new authentication.
 */
function invalidateUser(app, users) {
    var invalidUsers = app.get('invalidUsers');
    if (_.isUndefined(invalidUsers)) {
        invalidUsers = {};
        app.set('invalidUsers', invalidUsers);
    }

    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        invalidUsers[user.id.toString()] = true;
    }
}

function createAuthenticationMiddleware(resourceHandlerName, operation, callbacks, indexForRouteHandler) {
    //If it is a protected resource, lets analise the "authorizations"
    //First, get default auth for this verb.
    var roles = conf.application.autorizacoes.defaultPermissionsPerVerb[operation.verb];

    //Now check for specific authorizations for the route.
    var specificAuthorization = conf.application.autorizacoes.autorizacoes[resourceHandlerName];
    if (specificAuthorization) {
        //Now, we check for specific roles for this verb (within the resource). If NOT, mantain default permission.
        //Thus, if we wish to block a resource/verb, just create a permission with empty array.
        var specificRole = specificAuthorization[operation.verb];
        if (specificRole) {
            roles = specificRole;
        }
    }
    //Se não houver roles, então podemos sair fora. Significa que este recurso, EMBORA seja protegido, 
    //permite que qualquer perfil o acesse.
    if (_.isUndefined(roles)) {
        return indexForRouteHandler;
    }

    var callbackAutorizacao = (function(roles) {
        var permitedRoles = roles;

        var checkNecessaryAuthorizationFunction = function(req, res, next) {
            var usu = req.user;
            for (var i = 0; i < permitedRoles.length; i++) {
                var roleCode = permitedRoles[i];
                if (usu.hasValidRole(roleCode)) {
                    return next();
                }

            }
            return next('User does not necessary authorization.');
        };

        return checkNecessaryAuthorizationFunction;
    })(roles);

    callbacks[indexForRouteHandler] = callbackAutorizacao;
    return indexForRouteHandler + 1;
}


function createGoogleLoginUrl(req) {
        var referer = getReferer(req);

        //create cross-site request forgery (CSRF) token
        var sess = req.session;

        var buf = crypto.pseudoRandomBytes(256);
        var md5 = crypto.createHash('md5');

        md5.update(buf);
        var statetoken = md5.digest('base64');
        statetoken = validator.blacklist(statetoken, ':/\\?#\\[\\]@!\\$&\'\\(\\)\\*\\+,;=') + 'referer=' + referer;




        //put into session for later use.
        sess.statetoken = statetoken;
        console.log('generated CSRF token: ' + statetoken);


        var loginurl = conf.google.authenticationendpoint + '?' +
            'client_id=' + conf.google.applicationid + '&' +
            'response_type=code&' +
            'scope=' + conf.google.authenticationscope + '&' +
            'redirect_uri=' + conf.google.callbackurl + '&' +
            'approval_prompt=' + conf.google.approvalPrompt + '&' +
            'state=' + statetoken;

        return loginurl;

    }


function hidrateZidecoUser(user, callback) {
    //Criar promessa
    //Remove P do ponto para adequaro ao KD.
    user.ponto = user.username.replace('P_', '');

    var hydrationPhases = new PhaseController(['dbUser', 'dbRoles']);
    var cbPhaseConcluded = function(phaseName) {
        var finished = hydrationPhases.endPhase(phaseName);
        if (finished) {
            callback(null, user);
        }
    };

    //Here we hydrate the user. for now, do nothing...
    cbPhaseConcluded('dbUser');
    cbPhaseConcluded('dbRoles');


    //###################                   DATABASE                   ###################
    // var filtros;
    // var pesquisa;
    // var sql;
    //###################                   User Data                   ###################
    // conf.mysql.getConnection(function(err, connection) {
    //     if (err) {
    //         callback('Não foi possivel hidratar o usuario com baso no banco. Erro ao tentar conectar com o banco.', undefined);
    //         connection.release();
    //         return;
    //     }

    //     filtros = {
    //         identificador: user.ponto,
    //         usarlike: true
    //     };
    //     pesquisa = queriesUsuario.retornaQuerykdUsuario(filtros);
    //     sql = pesquisa.clausulaSelect + pesquisa.clausulaWhere + pesquisa.clausulaOrderBy;
    //     connection.query(sql, pesquisa.parametros, function(err, rows) {
    //         connection.release();
    //         if (err) {
    //             callback('Não foi possivel hidratar o usuario com baso no banco. Erro ao pesquisar o usuario no banco: ' + err, undefined);
    //             return;
    //         }

    //         // var resultcount = rows.length + prefetchedresults.length;
    //         if (rows.length === 0 || rows.length > 1) {
    //             callback('Consulta de usuario com o identificador ' + filtros.identificador + ' retornou quantidade invalida de linhas: ' + rows.length);
    //             return;
    //         }

    //         if (rows.length > 0) {
    //             //Criamos os objetos hierarquizados.
    //             var usuario = modelUsuario.kdUsuarioFromResultadoQuery(rows)[0];
    //             //Se o usuario tiver uma data de validade anterior a hoje, causa erro.
    //             if (!_.isNull(usuario.dataValidade) &&
    //                 !_.isUndefined(usuario.dataValidade) &&
    //                 moment(usuario.dataValidade).isBefore(moment())) {
    //                 callback('Usuário inválido. Consulte o administrador do KD', undefined);
    //                 return;


    //             }


    //             user.usuarioCompleto = usuario;
    //         }

    //         cbEtapaConcluida('bancoUsuario');
    //     });

    //     // console.log('Dentro de resolveConexao connected com thread id: ' + connection.threadId);
    //     // callback(connection, req, res);
    // });

    //###################                   User Roles                   ###################
    // conf.mysql.getConnection(function(err, connection) {
    //     if (err) {
    //         callback('Não foi possivel hidratar o usuario com baso no banco. Erro ao tentar conectar com o banco.', undefined);
    //         connection.release();
    //         return;
    //     }

    //     filtros = {
    //         identificadorusuario: user.ponto
    //     };
    //     pesquisa = queriesHistoricoPerfil.retornaQueryHistoricoPerfilUsuario(filtros);
    //     sql = pesquisa.clausulaSelect + pesquisa.clausulaWhere + pesquisa.clausulaOrderBy;

    //     connection.query(sql, pesquisa.parametros, function(err, rows) {
    //         connection.release();
    //         if (err) {
    //             callback('Não foi possivel hidratar o usuario com baso no banco. Erro ao pesquisar o usuario no banco: ' + err, undefined);
    //             return;
    //         }

    //         // var resultcount = rows.length + prefetchedresults.length;

    //         if (rows.length > 0) {
    //             //Criamos os objetos hierarquizados.
    //             var historicoPerfis = modelHistoricoPerfil.kdusuarioHistoricoPerfilFromResultadoQueryPerspUsuario(rows);
    //             user.historicoPerfis = historicoPerfis;
    //             user.perfilIndex = kdutils.buildIndex(user.historicoPerfis, 'perfil.codigo', '$index');
    //         }
    //         cbEtapaConcluida('bancoPerfis');
    //     });
    // });




}

module.exports = function(parconf) {
    conf = parconf;
    return {
        validateAuthentication: validateAuthentication,
        hidrateZidecoUser: hidrateZidecoUser,
        invalidateUser: invalidateUser,
        createAuthenticationMiddleware: createAuthenticationMiddleware,
        getReferer:getReferer,
        createGoogleLoginUrl: createGoogleLoginUrl
            // ,
            // Usuario:Usuario
    };
};
