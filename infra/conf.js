/***
 * Este modulo representa o objeto de configuracao da aplicacao backend.
 *
 */


var tool = require('cloneextend'),
  conf = {};

conf.production = {
  db: {
    mysql: {
      host: 'srv-cedi-pro',
      user: 'usrkd',
      password: 'senha',
      database: 'dbkd',
      port: 3306
    }
  },
  application: {
    apiroute: '/kdapi',
    protocolprefix: 'http://',
    exposedportprefix: '',
    errorHandler: { dumpExceptions: true, showStack: true }
  },
  server: {
    fqhost: 'srv-cedi-pro',
    host: 'srv-cedi-pro',
    port: '3030'
  },
  cas: {
    urlbase: 'https://cas.camara.gov.br/cas'
  }
};


conf.development = {
  db: {
    mysql: {
      host: 'localhost',
      user: 'dbzideco',
      password: 'senha',
      database: 'zidecohome',
      port: 3306
    }
  },
  application: {
    apiroute: '',
    protocolprefix: 'http://',
    exposedportprefix: ':3030',
    errorHandler: { dumpExceptions: true, showStack: true }
  }
};

conf.defaults = {
  application: {




    salt: '29654284BUGALA2323SHARE',
    username: 'clangton',
    password: 'GR+adJAdWOxFQMLFHAWPig==',
    realm: 'Authenticated',
    resources: {
      protegido: [
//        {
//          resourceName: 'resumopessoas',
//          validOperations : [
//            {verb: 'get', func: 'get', idInRoute:false},
//            {verb: 'get', func: 'find', idInRoute:true}
//          ]
//        }

      ],
      public: [
        'simpleroute'
//          ,
//          {
//          resourceName: 'foo',
//          validOperations : [
//              {verb: 'get', func: 'find', idInRoute:true},
//              {verb: 'post', func: 'ins', idInRoute:false},
//              {verb: 'put', func: 'upd', idInRoute:true},
//              {verb: 'delete', func: 'del', idInRoute:true}
//          ]
//          }
      ]
    }


  },
  server: {
    fqhost: 'localhost',
    host: 'localhost',
    port: 3030
  },
  validEnvs: {
    dev: 'development',
    prod: 'production'
  },
  google: {
      authenticationendpoint: 'https://accounts.google.com/o/oauth2/auth',
      applicationid: '965550095210-5l68e76451uj3cjau9oahkmov3l9lk2l.apps.googleusercontent.com',
      authenticationscope:'openid%20email&',
      callbackroute: '/auth/google/return/'
  }



};


/**
 *
 * @param env - String representing envirnoment (PROD, DEV, etc.)
 * @param obj - Object to be concatenated to existing params
 * @returns objet with configurations
 */
exports.get = function get(env, obj) {
  if (env === undefined) {
    env = 'development';
  }
  var settings = tool.cloneextend(conf.defaults, conf[env]);

  //Here we can create new configs, based on sessings object.
    //TODO: Change protocolprefix and exposedportprefix to server section.
    settings.google.callbackurl =
    settings.application.protocolprefix +
    settings.server.fqhost +
    settings.application.exposedportprefix +
    settings.application.apiroute + settings.google.callbackroute;

  return ('object' === typeof obj) ? tool.cloneextend(settings, obj) : settings;
};



