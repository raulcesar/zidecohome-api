/***
 * Este modulo representa o objeto de configuracao da aplicacao backend.
 *
 */
'use strict';

var tool = require('cloneextend'),
  conf = {},
  confroutes = require('./resources_conf'),
  confautorizacoes = require('./resources_auth_conf');



// conf.production = {
// };


conf.defaults = {
  db: {
    postgres: {
      host: 'localhost',
      user: 'zideco',
      password: 'zideco',
      database: 'zideco',
      port: 5432
    }
  },

  application: {
    sessionsecret: 'izabouandjohnyy234$23',
    sessionCookieKey: 'connect.sid',
    salt: '29654284BUGALA2323SHARE',
    username: 'clangton',
    password: 'GR+adJAdWOxFQMLFHAWPig==',
    realm: 'Authenticated',
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
    authenticationscope: 'openid%20email&',
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

  var resources = {
    application: {
      resources: tool.cloneextend(confroutes.defaults, confroutes[env])
    }
  };
  var autorizacoes = {
    application: {
      autorizacoes: tool.cloneextend(confautorizacoes.defaults, confautorizacoes[env])
    }
  };


  //Here we can create new configs, based on sessings object.
  //TODO: Change protocolprefix and exposedportprefix to server section.
  settings.google.callbackurl =
    settings.application.protocolprefix +
    settings.server.fqhost +
    settings.application.exposedportprefix +
    settings.application.apiroute + settings.google.callbackroute;

  settings = tool.cloneextend(settings, resources);
  settings = tool.cloneextend(settings, autorizacoes);


  return ('object' === typeof obj) ? tool.cloneextend(settings, obj) : settings;
};
