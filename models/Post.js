'use strict';
var zidecoseq = require('../zidecoseq');

module.exports = function(sequelize, DataTypes) {
    var Post = zidecoseq.define(sequelize, 'Post', {
            code: DataTypes.STRING,
            description: DataTypes.STRING
        }, {
            classMethods: {
                associate: function(models) {
                    Post.belongsToMany(models.TagMama, {
                        as: {
                            singular: 'tig',
                            plural: 'tigs'
                        },
                        through: {
                            model: models.ItemXTag
                        }
                    });

                    Post.belongsToMany(models.UserRole, {
                        as: {
                            singular: 'role',
                            plural: 'roles'
                        },
                        through: {
                            model: models.UserXrole
                        }
                    });

                    // Post.belongsToMany(models.TagMama, {
                    //     as: 'tig',
                    //     through: {
                    //         model: models.ItemXTag
                    //     }
                    // });


                    // Post.belongsToMany(models.UserRole, {
                    //     as: 'role',
                    //     through: {
                    //         model: models.UserXrole
                    //     }
                    // });

                }
            }
        }

    );

    return Post;
};
