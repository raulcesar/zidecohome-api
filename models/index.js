"use strict";

module.exports = function (conf) {


  var fs = require("fs");
  var path = require("path");
  // var Sequelize = require("sequelize");
  var env = process.env.NODE_ENV || "development";
//  var config = require(__dirname + '/../config/config.json')[env];

//  var sequelize = new Sequelize(config.database, config.username, config.password, config);
  var db = {};

  //read all files in this directory and map the model.
  fs
    .readdirSync(__dirname)
    .filter(function (file) {
      return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function (file) {
      var model = require(path.join(__dirname, file), conf.bookshelf);
      db[model.name] = model;
    });

  // Object.keys(db).forEach(function (modelName) {
  //   if ("associate" in db[modelName]) {
  //     db[modelName].associate(db);
  //   }
  // });

  //Return the models.
  return db;
}