'use strict';
var _ = require('lodash');
var fs = require('fs');
var mongoose = require('mongoose');

module.exports = function(conf, cb) {

    var defineModel = function(models) {
        models = models || {};
        var nonModelFiles = ['index.js'];

        var postprocesss = [];
        //Read all models from current directory, filtering current file (of course)
        fs
            .readdirSync(__dirname)
            .filter(function(file) {
                return (file.indexOf('.') !== 0) && nonModelFiles.indexOf(file) < 0;
            })
            .forEach(function(file) {
                var schema = require('./' + file);
                // if (_.isFunction(retfunc)) {
                //     postprocesss.push(require('./' + file)(models));
                // }
                models[schema.schemaName] = schema.schemaValue;
            });


        postprocesss.forEach(function(func) {
            func();
        });
        return models;
    };

    // var type = conf.type || 'standalone';

    // if (type === 'standalone') {
    // var opts = {
    //     host: conf.db.postgres.host,
    //     database: conf.db.postgres.database,
    //     user: conf.db.postgres.user,
    //     password: conf.db.postgres.password,
    //     protocol: 'postgres',
    //     // socketPath: '/var/run/mysqld/mysqld.sock',
    //     port: conf.db.postgres.port,
    //     query: {
    //         pool: true,
    //         debug: true
    //     }
    // };

    // orm.connect(opts, function(err, db) {
    //     //Caching with my new "assocs on find" mecanism does not work very well.
    //     db.settings.set('instance.cache', false);
    //     var models = {
    //         orm: orm,
    //         db: db
    //     };

    //     defineModel(models);
    //     cb(models);
    // });
    var models = defineModel();

    return {models:models};




};
