'use strict';

module.exports = function(conf, cb) {

    var fs = require('fs');
    var path = require('path');
    // var Sequelize = require('sequelize');
    // var Sequelize = require('../submodules/sequelize');
    var orm = require('orm');




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
        var validFiles = ['ZidecoUser.js', 'ZidecoUserAlias.js'];
        console.log('connected');



        var models = {
            db:db
        };
        //Read all models from current directory, filtering current file (of course)
        fs
            .readdirSync(__dirname)
            .filter(function(file) {
                // return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file !== 'ConstantEnums.js');
                return validFiles.indexOf(file) >= 0;
            })
            .forEach(function(file) {
                require('./' + file)(models);
                // models[model.name] = model;
                console.log('file: ' + file);
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
