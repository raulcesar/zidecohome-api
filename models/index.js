'use strict';
var _ = require('lodash');

module.exports = function(conf, cb) {

    var fs = require('fs');
    var path = require('path');
    // var Sequelize = require('sequelize');
    // var Sequelize = require('../submodules/sequelize');
    var orm = require('../submodules/orm/lib/ORM');




    // var options = {
    //     host: conf.db.postgres.host,
    //     port: conf.db.postgres.port,
    //     dialect: 'postgres',
    //     // logging: false,
    //     logging: function(str) {
    //         console.log(str);

    //     },
    //     define: {
    //         freezeTableName: true,


    //         // underscored: false,
    //         // freezeTableName: false,
    //         // syncOnAssociation: true,
    //         // charset: 'utf8',
    //         // collate: 'utf8_general_ci',
    //         // classMethods: {method1: function() {}},
    //         // instanceMethods: {method2: function() {}},
    //         timestamps: true
    //     },
    //     // quoteIdentifiers: false,
    //     pool: {
    //         maxConnections: 10,
    //         maxIdleTime: 30
    //     }
    // };

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
        var validFiles = ['ZidecoUser.js', 'TimeEntry.js', 'ZidecoUserAlias.js', 'UserRole.js' ];
        // var validFiles = ['ZidecoUser.js', 'ZidecoUserAlias.js', 'UserRole.js'];
        console.log('connected');



        var models = {
            db:db
        };
        var postprocesss = [];
        //Read all models from current directory, filtering current file (of course)
        fs
            .readdirSync(__dirname)
            .filter(function(file) {
                // return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file !== 'ConstantEnums.js');
                return validFiles.indexOf(file) >= 0;
            })
            .forEach(function(file) {
                var retfunc = require('./' + file)(models);
                if (_.isFunction(retfunc)) {
                    postprocesss.push(require('./' + file)(models));
                }
                
                // models[model.name] = model;
                console.log('file: ' + file);
            });


        postprocesss.forEach(function(func) {
            func();
        });



        // Object.keys(models).forEach(function(modelName) {
        //     if ('associate' in models[modelName]) {
        //         models[modelName].associate(models);
        //     }
        // });

        // models.sequelize = sequelize;
        // models.Sequelize = Sequelize;
        // models.db = db;

        cb( models);
    });
    

};
