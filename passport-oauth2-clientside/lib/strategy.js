/**
 * Module dependencies.
 */
var passport = require('passport-strategy')
    , util = require('util')
    , lookup = require('./utils').lookup
    , https = require('https')
    , http = require('http')
    , url = require('url');

//var ldapQuerier = require('../../model/ldapQuerier');


/**
 * `Strategy` constructor.
 *
 * The local authentication strategy authenticates requests based on the
 * credentials submitted through an HTML-based login form.
 *
 * Applications must supply a `verify` callback which accepts `username` and
 * `password` credentials, and then calls the `done` callback supplying a
 * `user`, which should be set to `false` if the credentials are not valid.
 * If an exception occured, `err` should be set.
 *
 * Optionally, `options` can be used to change the fields in which the
 * credentials are found.
 *
 * Options:
 *   - `usernameField`  field name where the username is found, defaults to _username_
 *   - `passwordField`  field name where the password is found, defaults to _password_
 *   - `passReqToCallback`  when `true`, `req` is the first argument to the verify callback (default: `false`)
 *
 * Examples:
 *
 *     passport.use(new LocalStrategy(
 *       function(username, password, done) {
 *         User.findOne({ username: username, password: password }, function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @api public
 */
function Strategy(options) {
    if (!options) {
        options = {
            tockenParm: 'access_token'
        };
    }

    this._tockenParm = options.tockenParm ;
    passport.Strategy.call(this);
    this.name = 'kdcas';
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the CAS ticket, in request.
 *
 * @param {Object} req
 * @param {Object} options
 * @api protected
 */
Strategy.prototype.authenticate = function (req, options) {
    options = options || {};

    //Get tocken from req
    var tocken = req.param(this._tockenParm);

    //If no tocken, than fail, and allow the "failure" redirect to send user to GOOGLE login page
    if (!tocken) {
        return this.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400);
    }

    var self = this;

    function verified(err, user, info) {
        if (err) {
            return self.error(err);
        }
        if (!user) {
            return self.fail(info);
        }
        self.success(user, info);
    }

    try {
        //Here we will attempt to call the tocken validation at google
        //Also, send function callback that will "verify" the user.
        this.tockenValidate(tocken, verified);
    } catch (ex) {
        return self.error(ex);
    }
};


Strategy.prototype.tockenValidate = function (token, callback) {
//  var validationpath = url.format({
//    pathname: 'https://cas.camara.gov.br/cas/validate',
//    query: {service: service, ticket: ticket}
//  });

//    var agent = new HttpsProxyAgent({
//        proxyHost: '192.168.5.8',
//        proxyPort: 3128
//    });

//    var options = {
//        hostname: 'www.googleapis.com',
////        port: 443,
//        path: url.format({
//            pathname: '/oauth2/v1/tokeninfo',
//            query: {access_token: token}
//        }),
//        method: 'GET'
//    };

    var options = {
        hostname: 'localhost',
        port: 3128,
        path: url.format({
            pathname: 'https://www.googleapis.com/oauth2/v1/tokeninfo',
            query: {access_token: token}
        }),
        headers: {
            Host: "www.googleapis.com"
        },
        method: 'GET'
    };

    var body = '';
    var req = http.request(options, function (res) {
        console.log('REQUEST STATUS: ' + res.statusCode);
        console.log('REQUEST HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            body += chunk;
        });
        res.on('end', function () {
            console.log("BODY: " + body);
            //Body will be a json object...
            var validatedTocken = JSON.parse(body);

            //TODO: check that clienid is correct:
            //If not: callback('Invalid ClientID', undefined);
            //get user from tocken:
            var userEmail = validatedTocken.email;


            //TODO: IF UNABLE TO GET USER, RETURN ERROR
            //TODO: Now get user from our stores, and populate the user object.
            var user = {email: userEmail};
            callback(null, user, validatedTocken);
        });

    });

//    https.get('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=ya29.kgCQnNopP_uGEfpjTcCoGxC12UA9T4gs_JDun6G6gjyKd9arvzGRU78M',
//        function(res) {
//            res.setEncoding('utf8');
//            res.on('data', function (chunk) {
//                console.log('BODY: ' + chunk);
//                body += chunk;
//            });
//            res.on('end', function () {
//                console.log("BODY: " + body);
//                //Body will be a json object...
//                var validatedTocken = JSON.parse(body);
//
//                //TODO: check that clienid is correct:
//                //If not: callback('Invalid ClientID', undefined);
//                //get user from tocken:
//                var userEmail = validatedTocken.email;
//
//
//                //TODO: IF UNABLE TO GET USER, RETURN ERROR
//                //TODO: Now get user from our stores, and populate the user object.
//                var user = {email: userEmail};
//                callback(null, user, validatedTocken);
//            });
//
//        }
//    ).on('error', function(e) {
//            console.log("Got error: " + e.message);
//        });
//

//    var req = https.request(options, function (res) {
//        console.log('REQUEST STATUS: ' + res.statusCode);
//        console.log('REQUEST HEADERS: ' + JSON.stringify(res.headers));
//        res.setEncoding('utf8');
//        res.on('data', function (chunk) {
//            console.log('BODY: ' + chunk);
//            body += chunk;
//        });
//        res.on('end', function () {
//            console.log("BODY: " + body);
//            //Body will be a json object...
//            var validatedTocken = JSON.parse(body);
//
//            //TODO: check that clienid is correct:
//            //If not: callback('Invalid ClientID', undefined);
//            //get user from tocken:
//            var userEmail = validatedTocken.email;
//
//
//            //TODO: IF UNABLE TO GET USER, RETURN ERROR
//            //TODO: Now get user from our stores, and populate the user object.
//            var user = {email: userEmail};
//            callback(null, user, validatedTocken);
//        });
//
//    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        callback(e);
    });

    req.end();
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
