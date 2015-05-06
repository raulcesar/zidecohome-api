'use strict';
var zidecoseq = require('../zidecoseq');

/**
This entity represents a time period delimited by a start and end period.
*/
module.exports = function(sequelize, DataTypes) {
    // var globalmixin = sequelize.globalmixin;
    var TimeEntryPeriod = zidecoseq.define(sequelize, 'TimeEntryPeriod', {
        startTime: {
            type: DataTypes.DATE,
            allowNull: false
         },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false
         },
        dayReference: DataTypes.DATE,
        rawMinutes: DataTypes.INTEGER,
        validMinutes: DataTypes.INTEGER,
        origin: DataTypes.ENUM('generated', 'manual')

    }, {
        classMethods: {
            associate: function(models) {
                TimeEntryPeriod.belongsTo(models.TimeEntry, {as: 'startEntry'});
                TimeEntryPeriod.belongsTo(models.TimeEntry, {as: 'endEntry'});
            }
        }
    });

    return TimeEntryPeriod;
};
