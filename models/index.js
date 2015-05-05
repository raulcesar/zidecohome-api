'use strict';

module.exports = function(conf) {

   var fs = require('fs');
   var path = require('path');
   var Sequelize = require('../submodules/sequelize');

   var options = {
      host: conf.db.postgres.host,
      port: conf.db.postgres.port,
      dialect: 'postgres',
      // logging: false,
      logging: function(str) {
         console.log(str);

      },
      define: {
         freezeTableName: true,


         // underscored: false,
         // freezeTableName: false,
         // syncOnAssociation: true,
         // charset: 'utf8',
         // collate: 'utf8_general_ci',
         // classMethods: {method1: function() {}},
         // instanceMethods: {method2: function() {}},
         timestamps: true
      },
      // quoteIdentifiers: false,
      pool: {
         maxConnections: 10,
         maxIdleTime: 30
      }
   };

   var sequelize = new Sequelize(
      conf.db.postgres.database,
      conf.db.postgres.user,
      conf.db.postgres.password,
      options);

   var db = {};




   //  var dbOpts = {
   //    database : conf.db.postgres.database,
   //    protocol : 'postgres',
   //    host     : conf.db.postgres.host,
   //    port     : conf.db.postgres.port,         // optional, defaults to database default
   //    user     : conf.db.postgres.user,
   //    password : conf.db.postgres.password,
   //    query    : {
   //      pool     : true,   // optional, false by default
   //      debug    : false,   // optional, false by default
   //      strdates : false    // optional, false by default
   //    }
   //  };

   // var mixin = {
   //   attributes: {
   //     username: {type: Sequelize.STRING}
   //   }
   // };
   // sequelize.globalmixin = mixin;

   //Read all models from current directory, filtering current file (of course)
   fs
      .readdirSync(__dirname)
      .filter(function(file) {
         return (file.indexOf('.') !== 0) && (file !== 'index.js');
      })
      .forEach(function(file) {
         var model = sequelize['import'](path.join(__dirname, file));
         db[model.name] = model;
      });

   Object.keys(db).forEach(function(modelName) {
      if ('associate' in db[modelName]) {
         db[modelName].associate(db);
      }
   });

   db.sequelize = sequelize;
   db.Sequelize = Sequelize;

   return db;
};
