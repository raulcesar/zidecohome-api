"use strict";

module.exports = function (conf) {


  var fs = require("fs");
  var path = require("path");
  var Sequelize = require("sequelize");
  var env = process.env.NODE_ENV || "development";
//  var config = require(__dirname + '/../config/config.json')[env];

  var options = {
    "host": conf.db.mysql.host,
    "port": conf.db.mysql.port,
    "dialect": "mariadb",
    // logging: false,
    define: {
      attributes: {
        username: {type: Sequelize.STRING}
      },
      
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
    pool: {maxConnections: 10, maxIdleTime: 30}
  };

  var sequelize = new Sequelize(
    conf.db.mysql.database,
    conf.db.mysql.user,
    conf.db.mysql.password,
    options);

  var db = {};


//  var dbOpts = {
//    database : conf.db.mysql.database,
//    protocol : "mysql",
//    host     : conf.db.mysql.host,
//    port     : conf.db.mysql.port,         // optional, defaults to database default
//    user     : conf.db.mysql.user,
//    password : conf.db.mysql.password,
//    query    : {
//      pool     : true,   // optional, false by default
//      debug    : false,   // optional, false by default
//      strdates : false    // optional, false by default
//    }
//  };


  fs
    .readdirSync(__dirname)
    .filter(function (file) {
      return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function (file) {
      var model = sequelize["import"](path.join(__dirname, file));
      db[model.name] = model;
    });

  Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;
}