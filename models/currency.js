"use strict";
// var zidecoseq = require("../zidecoseq/globalmixins");
var zidecoseq = require("../zidecoseq");

module.exports = function(sequelize, DataTypes) {
    // var globalmixin = sequelize.globalmixin;
    var Currency = zidecoseq.define(sequelize, "Currency", {
        code: DataTypes.STRING,
        description: DataTypes.STRING,
        valueZidecos: DataTypes.BIGINT
    }
    // , 
    // {
    //     classMethods: {
    //         associate: function(models) {
    //             // associations can be defined here
    //         }
    //     }
    // }
    );

    return Currency;
};