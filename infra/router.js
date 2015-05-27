'use strict';
exports.run = function route(app, conf, passport) {
    var _ = require('lodash');
    var authenticationUtil = app.get('authenticationUtil');

    // var io = conf.io;


    var resources = conf.application.resources;
    var handlers = {};

    var rotaDeValidacaoDeToken = conf.google.callbackroute;


    var qtdRotas = 0;

    function includeStandardRoute(resource, isProtected, parentResourceName, parentRoute) {
        var validOperations;
        var resourceName;

        parentResourceName = parentResourceName || '';
        parentRoute = parentRoute || '';
        //Create array with default valid operations. This array can be rewritten by specific rout configurations.
        validOperations = [{
            verb: 'get',
            func: 'get',
            idInRoute: false
        }, {
            verb: 'get',
            func: 'find',
            idInRoute: true
        }, {
            verb: 'post',
            func: 'ins',
            idInRoute: false
        }, {
            verb: 'put',
            func: 'upd',
            idInRoute: true
        }, {
            verb: 'delete',
            func: 'del',
            idInRoute: true
        }];

        if (_.isString(resource)) {
            resourceName = resource;
        } else {
            //rewrite valid operations with specific resource config.
            if (resource.validOperations) {
                validOperations = resource.validOperations;
            }

            resourceName = resource.resourceName;
        }

        //This variable is necessary for hierarquical resources.
        //ex: resource pessoa/historicolotacao will be in a file called pessoahistoricolotacao.
        var resourceHandlerName = parentResourceName + resourceName;

        //TODO: maybe will use this... maybe not.
        //If its an "auxiliary table" type resource, lets use the generic handler.
        //Otherwise, use handler provided by resource file.
        // if (resource.tabauxName) {
        //     handlers[resourceHandlerName] = require('../routes/tabelasAuxiliares')(resource.tabauxName, resource.tabauxIdColName, resource.tabauxDescColName, resource.colunasExtras);
        // } else {
        //     handlers[resourceHandlerName] = require('../routes/' + resourceHandlerName);
        // }
        handlers[resourceHandlerName] = require('../routes/' + resourceHandlerName);

        var callbacks = [];
        var indexForRouteHandler = 0;
        if (isProtected) {
            //Get AUTHENTICATION middleware for the whole resource (all verbs).
            // callbacks[0] = validateAuthentication;
            //TODO: REFACTOR INTO AUTHENTICATIONUTIL
            callbacks[0] = authenticationUtil.validateAuthentication;
            //
            indexForRouteHandler = 1;
        }

        validOperations.forEach(function(operation) {
            //If resource is protected, each verb may have diferent authorizations. 
            //Here we check that and create middleware for each one.
            if (isProtected) {
                indexForRouteHandler = authenticationUtil.createAuthenticationMiddleware(resourceHandlerName, operation, callbacks, indexForRouteHandler);
            }


            //Now create route the current valid operation.
            callbacks[indexForRouteHandler] = handlers[resourceHandlerName][operation.func];

            var route = parentRoute + '/' + resourceName + (operation.idInRoute ? '/:id' : '');
            qtdRotas++;
            console.log('setting up route: ' + route + ' details: ' + operation.func + ' (verb: ' + operation.verb + ') - ' + resourceName);
            app[operation.verb](route, callbacks);
        });


        //If the resource exports and custom callbacks, include those as well.
        if (_.isFunction(handlers[resourceHandlerName].customcallbacks)) {

            console.log('setting up custom callbacks for resourceHandlerName : ' + resourceHandlerName);
            handlers[resourceHandlerName].customcallbacks(app, (isProtected ? authenticationUtil.validateAuthentication : null));
        }



        //Treat sub-resources (hierarquical structure)
        //If a resource has sub resources, just acll this function recursively.
        if (resource.subresources) {
            var newParentResourceName = parentResourceName + resourceName;
            var newParentRoute = parentRoute + '/' + resourceName + '/:id' + newParentResourceName;


            resource.subresources.forEach(function(subResource) {
                var autorizacoesDaRotaAtual = conf.application.autorizacoes.autorizacoes[newParentResourceName];
                if (autorizacoesDaRotaAtual) {
                    //If parent resource has specific authorizations, and the sub-resource DOES NOT have explicit one, then we inherit from the parent.
                    var subResourceName;
                    if (_.isString(subResource)) {
                        subResourceName = subResource;
                    } else {
                        subResourceName = subResource.resourceName;
                    }
                    var subReourceHandlerName = newParentResourceName + subResource;
                    var temExplicito = conf.application.autorizacoes.autorizacoes[subReourceHandlerName];
                    if (!temExplicito) {
                        conf.application.autorizacoes.autorizacoes[subReourceHandlerName] = autorizacoesDaRotaAtual;
                    }
                }



                includeStandardRoute(subResource, isProtected, newParentResourceName, newParentRoute);
            });
        }
    }


    //Create all standard routes based on config sent in. First protected, then public.
    resources.protegido.forEach(function(resource) {
        includeStandardRoute(resource, true);
    });

    resources.public.forEach(function(resource) {
        includeStandardRoute(resource, false);
    });



    //Routes for loging in with google. They create google authentication urls.
    //This one, responds with an "unauthorized" error.
    app.get('/logingoogle', function(req, res) {
        var loginurl = authenticationUtil.createGoogleLoginUrl(req);

        res.status(401).send({
            loginat: loginurl
        });
    });

    //This one, responds with a redirect
    app.get('/autologingoogle', function(req, res) {
        var loginurl = authenticationUtil.createGoogleLoginUrl(req);

        res.redirect(loginurl);
    });


    //Callback route from google!
    app.get(rotaDeValidacaoDeToken, function(req, res, next) {
        //This is the callback to which google will redirect the browser.
        //First we get the 'state' to validate that the client is valid.
        var sess = req.session;
        var stateFromSession = sess.statetoken;
        var stateFromRequest = req.query.state;
        // req.param('state');

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

        //Authenticate with passport.
        passport.authenticate('googleoauth2clientside', {
            model: req.ormmodels
        }, function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect(conf.application.apiroute + '/logingoogle?referer=' + referer);
            }

            //If all goes well, we have a user. Return a redirect to the "referer"
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }

                return res.redirect(referer);
            });
        })(req, res, next);
    });


    //Route exposed by passport to logout.
    app.get('/logout', function(req, res) {
        req.logout();
        res.send(200);
    });

    //Route to get current user. (maybe put this in "routes" folder)
    app.get('/currentuser', authenticationUtil.validateAuthentication, function(req, res) {
        var usu = req.user;
        res.json(200, usu);
    });


};
