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

var getUserIdWhereObject = function(req) {
	//First check if req sent userId
	var filtro = req.query;
	if (filtro.userId) {

	}


    //Get the current user and include id in where clause.
    var usu = req.user || {};
    var userId = filtro.userId || usu.id;

    if (!userId) {
        //This should never happen because this function should only be called by protected routes.
        return undefined;
    }
    var whereClause = {userId: userId};
    return whereClause;
};

module.exports = {
   satandardErrorTreater: satandardErrorTreater,
   getUserIdWhereObject:getUserIdWhereObject
};
