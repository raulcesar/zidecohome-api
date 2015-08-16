'use strict';
var zidecoseq = require('../zidecoseq');

module.exports = function(models) {
   var Currency = zidecoseq.define(models, 'Currency', {
         code: {
            type: 'text',
            size: 100
        },
         description: {
            type: 'text',
            size: 200
        },
         valueZidecos: {
            type: 'integer',
            size: 4
        },
      }
   );

   return;
};
