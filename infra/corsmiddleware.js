/**
 * Created by raul on 5/14/14.
 */

//TODO: EXPORTA ESTA FUNCAO COMO UM MIDDLEWARE.
module.exports = function corsmiddleware(options) {
  return function (req, res, next) {
    //Get the origin and put that in header, because if we don't, CHROME (maybe others as well) will say that because
    //Send credentials is on, * are not allowed!
    var origin = req.headers.origin;
    //Just to make sure that its "localhost"...

    if (origin) {
      var validOrigins = ['http://localhost:', 'https://localhost:'];
      var checkValidOrigin = function (element, index, array) {
        var ret = (origin.indexOf(element) === 0);
        return ret;
      }
      if (validOrigins.some(checkValidOrigin)) {
        res.header('Access-Control-Allow-Origin', origin);
      }
    }


//    res.header('Access-Control-Allow-Origin', allowheader);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');


    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
  }
};