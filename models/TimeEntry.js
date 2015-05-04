'use strict';
// var zidecoseq = require('../zidecoseq/globalmixins');
var zidecoseq = require('../zidecoseq');

module.exports = function(sequelize, DataTypes) {
    // var globalmixin = sequelize.globalmixin;
    var TimeEntry = zidecoseq.define(sequelize, 'TimeEntry', {
        entryTime: DataTypes.DATE,
        origin: DataTypes.STRING
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

    return TimeEntry;
};

