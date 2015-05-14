'use strict';
var zidecoseq = require('../zidecoseq');

module.exports = function(models) {
    var ZidecoUserAlias = zidecoseq.define(models, 'ZidecoUserAlias', {
        identifier: {
            type: 'text',
            size: 2000
        }
    });

    var opts = {
        reverse: 'aliases'
    };
    // ZidecoUserAlias.hasOne('user', models.ZidecoUser, {}, opts);
    var postprocess = function() {
    	ZidecoUserAlias.hasOne('user', models.ZidecoUser, {}, opts);
    };

    return postprocess;
};
