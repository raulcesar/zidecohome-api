exports.run = function route(app, conf, passport) {
  var _ = require('lodash');
  var resources = conf.application.resources;
  var handlers = {};

  // Funcao MIDDLEWARE que verifica se usuario esta logado.
  // Caso não esteja, será direcionado para validacao de cas.
  function validaAutenticacao(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
      return next();
    }

    // Se não estiver logado, joga para a pagina inicial. Na verdade, aqui, acho que vou enviar um "UNATHORIZED"
    res.redirect(conf.application.apiroute + '/validacas');
  }


  function incluiRotasPadrao(resource, protegido) {
    var validOperations;
    var resourceName;

    //Montamos um vetor de "operacoes validas" default. Este vetor pode ser sobreescrito pela configuracao.
    validOperations = [
      {verb: 'get', func: 'get', idInRoute:false},
      {verb: 'get', func: 'find', idInRoute:true},
      {verb: 'post', func: 'ins', idInRoute:false},
      {verb: 'put', func: 'upd', idInRoute:true},
      {verb: 'delete', func: 'del', idInRoute:true}
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
      handlers[resourceName] = require('../routes/' + resourceName);
    }

    //Logica para incluir callback de autenticação (quando rotas protegidas)
    var callbacks = [];
    var indexForRouteHandler = 0;
    if (protegido) {
      callbacks[0] = validaAutenticacao;
      indexForRouteHandler = 1;
    }

    validOperations.forEach(function(operation) {
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


  app.get('/protegida', validaAutenticacao, function(req, res) {
    res.json(200, {'RecursoProtegitdo: ': 'blablabla...'});
  });

  app.get('/restpublica/:id', function(req, res) {
    res.json(200, {'RecursoPublico': 'blablabla...'});
  });

  //Abaixo exemplo com POST passando usuario e senha.
//  app.post('/login', passport.authenticate('local-login', {
//    successRedirect : '/yo', // redirect to the secure profile section
//    failureRedirect : '/login', // redirect back to the signup page if there is an error
//    failureFlash : false // allow flash messages
//  }));

//  app.get('/validacasold', passport.authenticate('kdcas-validate',
//
//    {
////    successRedirect : '/casvalidado', // redirect to the secure profile section
//    failureRedirect : '/logincas', // redirect back to the signup page if there is an error
//    failureFlash : false, // allow flash messages
//    service: 'http://localhost:8080/validacas'
//  }));

  function getReferer(req) {
    return req.param('referer') || req.header('referer') || 'http://srv-cedi-bdi/wiki';
  }
  app.get('/validacas', function(req, res, next) {
    var referer = getReferer(req);
    var serviceurl = conf.cas.callbackURL + '?referer=' + referer;

//    console.log('entrei no validacas. referer: ' + referer + ' serviceurl: ' + serviceurl);

    passport.authenticate('kdcas-validate',  {service: serviceurl}, function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect(conf.application.apiroute + '/logincas'); }

      //Se deu tudo certo, ou seja, temos um usuario, entao retorna apenas com
      //200OK

      req.logIn(user, function(err) {
        if (err) { return next(err); }


//        console.log('entrei no req.logIn. referer: ' + referer + ' usuario: ' + JSON.stringify(user));
        return res.redirect(referer);
//        return res.redirect('http://localhost:63342/kd-frontend/app/index.html');
      });
    })(req, res, next);
  });



  app.get('/logincas', function(req, res) {
    var referer = getReferer(req);
    var loginaturl = conf.cas.urlbase + '/login?service=' + conf.cas.callbackURL + '?referer=' + referer;
//    console.log('entrei no logincas. referer: ' + referer + ' loginaturl: ' + loginaturl + '. Vou retornar 401.');
    res.send(401, {loginat: loginaturl} );
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.send(200);
  });


  app.get('/usuariocorrente', validaAutenticacao, function(req, res) {
    var usu = req.user;
    res.json(200, usu);
  });





};
