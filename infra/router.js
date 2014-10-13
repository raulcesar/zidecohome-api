exports.run = function route(app, conf, passport, io) {
    var _ = require('lodash');
    var crypto = require('crypto');


    var resources = conf.application.resources;
    var handlers = {};

    var rotaDeValidacaoDeToken = conf.google.callbackroute;


    // Funcao MIDDLEWARE que verifica se usuario esta logado.
    // Caso não esteja, será direcionado para validacao de cas.
    function validaAutenticacao(req, res, next) {
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated()) {
            return next();
        }

        // Se não estiver logado, joga para a pagina de login do GOOGLE... POSSIVELMENTE vou jogar para uma pagina de login do aplicativo.
        var referer = req.originalUrl;

        res.redirect(conf.application.apiroute + "/logingoogle" + '?referer=' + referer);
    }


    function incluiRotasPadrao(resource, protegido) {
        var validOperations;
        var resourceName;

        //Montamos um vetor de "operacoes validas" default. Este vetor pode ser sobreescrito pela configuracao.
        validOperations = [
            {verb: 'get', func: 'get', idInRoute: false},
            {verb: 'get', func: 'find', idInRoute: true},
            {verb: 'post', func: 'ins', idInRoute: false},
            {verb: 'put', func: 'upd', idInRoute: true},
            {verb: 'delete', func: 'del', idInRoute: true}
        ];

        if (_.isString(resource)) {
            resourceName = resource;
        } else {
            //Sobreescreve operacoes validas, caso existam.
            if (resource.validOperations) {
                validOperations = resource.validOperations;
            }

            resourceName = resource.resourceName;
        }

        //Se for uma tabela auxiliar, vamos utilizar o "handler" generico.
        //Se não, usamos o "handler" com o mesmo nome do resourceName.
        if (resource.tabauxName) {
            handlers[resourceName] =
                require('../routes/tabelasAuxiliares')(resource.tabauxName, resource.tabauxIdColName, resource.tabauxDescColName);
        } else {
          if (resource.iosocket) {
            handlers[resourceName] = require('../routes/' + resourceName)(io);
          } else {
            handlers[resourceName] = require('../routes/' + resourceName);
          }
        }

        //Logica para incluir callback de autenticação (quando rotas protegidas)
        var callbacks = [];
        var indexForRouteHandler = 0;
        if (protegido) {
            callbacks[0] = validaAutenticacao;
            indexForRouteHandler = 1;
        }

        validOperations.forEach(function (operation) {
            callbacks[indexForRouteHandler] = handlers[resourceName][operation.func];
            app[operation.verb]('/' + resourceName + (operation.idInRoute ? '/:id' : ''), callbacks);
        });

        //Se a rota exporta callbacks customizados, chame-os aqui.
        if (_.isFunction(handlers[resourceName]['customcallbacks'])) {
            handlers[resourceName]['customcallbacks'](app, (protegido ? validaAutenticacao : null));
        }

    }

    //Aqui criamos as rotas padrões para os recursos definidos em application.resources no "conf.js"
    //La existem 2 arrays. Um "protegido" com rotas que devem ser autenticadas e outro "public" com
    //recursos nao protegidos (que não exigem login).
    resources.protegido.forEach(function (resource) {
        incluiRotasPadrao(resource, true);
    });

    resources.public.forEach(function (resource) {
        incluiRotasPadrao(resource, false);
    });


    app.get('/protegida', validaAutenticacao, function (req, res) {
        res.json(200, {'RecursoProtegitdo: ': 'blablabla...'});
    });

    app.get('/restpublica/:id', function (req, res) {
        res.json(200, {'RecursoPublico': 'blablabla...'});
    });

    function getReferer(req) {
        return req.param('referer') || req.header('referer') || 'http://srv-cedi-bdi/wiki';
    }

    app.get('/logingoogle', function (req, res) {
        var referer = getReferer(req);

        //create cross-site request forgery (CSRF) token
        var sess = req.session;

        var buf = crypto.pseudoRandomBytes(256);
        var md5 = crypto.createHash('md5');

        md5.update(buf);
        var statetoken = md5.digest('base64') + 'referer=' + referer;

        //put into session for later use.
        sess.statetoken = statetoken;
        console.log('generated CSRF token: ' + statetoken);


        var loginurl = conf.google.authenticationendpoint + '?' +
            'client_id=' + conf.google.applicationid + '&' +
            'response_type=code&' +
            'scope=' + conf.google.authenticationscope + '&' +
            'redirect_uri=' + conf.google.callbackurl + '&' +
            'state=' + statetoken;
        res.send(401, {loginat: loginurl});
    });


    app.get(rotaDeValidacaoDeToken, function (req, res, next) {
        //aqui é o callback para onde o google direciona o brower.
        //Vamos primeiro pegar o "state" para validar que está vindo de um cliente válido.
        var sess = req.session;
        var stateFromSession = sess.statetoken;
        var stateFromRequest = req.param('state');

        if (stateFromRequest !== stateFromSession) {
            console.log('stateFromRequest: ' + stateFromRequest);
            console.log('stateFromSession: ' + stateFromSession);
          console.log('testcondition: ' + stateFromRequest !== stateFromSession);

            return next(new Error('Error validating authentication.\n' + stateFromRequest + '\n' + stateFromSession));
        }

        //Remove CSRF token from session:
        sess.statetoken = undefined;

        //Get referer from statetoken (referer=...).
        var referer = 'about:blank';
        var strIndex = stateFromRequest.indexOf('referer=');
        if (strIndex >= 0) {
            referer = stateFromRequest.split('referer=').pop();
        }

        //se houver o "codigo" como parametro, deve funcionar.
        passport.authenticate('googleoauth2clientside', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect(conf.application.apiroute + '/logingoogle?referer=' + referer);
            }

            //Se deu tudo certo, ou seja, temos um usuario, entao retorna apenas com
            //200OK

            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }

                return res.redirect(referer);
            });
        })(req, res, next);
    });


    //Route exposed by passport.
    app.get('/logout', function (req, res) {
        req.logout();
        res.send(200);
    });


    app.get('/currentuser', validaAutenticacao, function (req, res) {
        var usu = req.user;
        res.json(200, usu);
    });


};
