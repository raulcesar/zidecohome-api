"use strict";

module.exports = function(sequelize, DataTypes) {
  var Currency = sequelize.define("Currency", {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return Currency;
};
