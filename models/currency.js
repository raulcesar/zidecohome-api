"use strict";

module.exports = function(sequelize, DataTypes) {
  var Currency = sequelize.define("Currency", {
    code: DataTypes.STRING,
    description: DataTypes.STRING,
    valueZidecos: DataTypes.BIGINT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return Currency;
};
