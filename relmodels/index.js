'use strict';
var _ = require('lodash');
var fs = require('fs');
var orm = require('../submodules/orm/lib/ORM');

module.exports = function(conf, cb) {

    var defineModel = function(models) {
        var nonModelFiles = ['index.js'];
        console.log('connected');

        var postprocesss = [];
        //Read all models from current directory, filtering current file (of course)
        fs
            .readdirSync(__dirname)
            .filter(function(file) {
                // return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file !== 'ConstantEnums.js');
                return (file.indexOf('.') !== 0) && nonModelFiles.indexOf(file) < 0;
            })
            .forEach(function(file) {
                var retfunc = require('./' + file)(models);
                if (_.isFunction(retfunc)) {
                    postprocesss.push(require('./' + file)(models));
                }

                console.log('file: ' + file);
            });


        postprocesss.forEach(function(func) {
            func();
        });
        return models;
    };

    // var type = conf.type || 'standalone';

    // if (type === 'standalone') {
    var opts = {
        host: conf.db.postgres.host,
        database: conf.db.postgres.database,
        user: conf.db.postgres.user,
        password: conf.db.postgres.password,
        protocol: 'postgres',
        // socketPath: '/var/run/mysqld/mysqld.sock',
        port: conf.db.postgres.port,
        query: {
            pool: true,
            debug: true
        }
    };

    orm.connect(opts, function(err, db) {
        //Caching with my new "assocs on find" mecanism does not work very well.
        db.settings.set('instance.cache', false);
        var models = {
            orm: orm,
            db: db
        };

        defineModel(models);
        cb(models);
    });
    // } else {
    //     return defineModel(conf.models);
    // }



};
