'use strict';
var zidecoseq = require('../zidecoseq');

module.exports = function(sequelize, DataTypes) {
    var ItemXTag = zidecoseq.define(sequelize, 'ItemXTag', {
            // tag_id: {
            //     type: DataTypes.INTEGER,
            //     unique: 'item_tag_taggable'
            // },
            taggable: {
                type: DataTypes.STRING,
                unique: 'item_tag_taggable'
            }
            // ,
            // taggable_id: {
            //     type: DataTypes.INTEGER,
            //     unique: 'item_tag_taggable',
            //     references: null
            // }
        }

    );

    return ItemXTag;
};
