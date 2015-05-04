'use strict';

var satandardErrorTreater = function(req, res) {
   var retFunc = function(err) {
      res.statusCode = '500';
      res.send({
         error: err
      });
   };

   return retFunc;
};

module.exports = {
   satandardErrorTreater: satandardErrorTreater
};
