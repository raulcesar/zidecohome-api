'use strict';
var zidecoseq = require('../zidecoseq');

module.exports = function(sequelize, DataTypes) {
    var TagMama = zidecoseq.define(sequelize, 'TagMama', {
            code: DataTypes.STRING,
            description: DataTypes.STRING
        }, {
            classMethods: {
                associate: function(models) {
                    TagMama.belongsToMany(models.Post, {
                        through: {
                            model: models.ItemXTag
                        }
                    });

                }
            }
        }

    );

    return TagMama;
};
