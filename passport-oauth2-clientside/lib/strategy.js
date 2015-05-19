'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport-strategy'),
    util = require('util'),
    // lookup = require('./utils').lookup,
    request = require('request'),
    _ = require('lodash'),
    url = require('url');

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
            googleTokenEndpoint: 'https://accounts.google.com/o/oauth2/token',
            googleTokenInfoEndpoint: 'https://www.googleapis.com/oauth2/v1/tokeninfo',
            appClientID: '965550095210-5l68e76451uj3cjau9oahkmov3l9lk2l.apps.googleusercontent.com',
            appClientSecret: '_rqDu5zzkKvmqja_la8UPhBd',
            appRedirectURI: 'http://localhost:3030/auth/google/return/'
        };
    }

    this.options = options;

    passport.Strategy.call(this);
    this.name = 'googleoauth2clientside';
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
Strategy.prototype.authenticate = function(req, options) {
    options = options || {};

    //Get the code for google authentication.
    var code = req.param('code');

    //If no code, than fail, and allow the "failure" redirect to send user to GOOGLE login page
    if (!code) {
        return this.fail({
            message: options.badRequestMessage || 'Missing credentials'
        }, 400);
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
        //Here we will attempt to call the token validation at google
        //Also, send function callback that will "verify" the user.
        this.codeValidate(code, options.model, verified);
    } catch (ex) {
        return self.error(ex);
    }
};


Strategy.prototype.codeValidate = function(code, model, callback) {
    /*jshint camelcase: false */
    var globalOptions = this.options;

    //Create options to post to google token endpoint and retrieve access token.
    var optionsForIDToken = {
        url: globalOptions.googleTokenEndpoint,
        method: 'POST',
        json: true,
        form: {
            code: code,
            client_id: globalOptions.appClientID,
            client_secret: globalOptions.appClientSecret,
            redirect_uri: globalOptions.appRedirectURI,
            grant_type: 'authorization_code'
        }

    };






    request(optionsForIDToken,
        function(error, response, body) {
            var msg;
            //The body should be a json object representing the returned validated token, or an error.
            //Check for error
            if (error) {
                console.log('problem with token validation request: ' + error.message);
                callback(error);
            }

            if (body.error) {
                msg = 'problem with token validation: ' + body.error_description;
                callback(new Error(msg));
            }

            if (!body.access_token) {
                msg = 'problem with token validation: No access_token';
                callback(new Error(msg));
            }

            if (!body.id_token) {
                msg = 'problem with token validation: No id_token';
                callback(new Error(msg));
            }

            var idToken = body.id_token;

            //Now lets validate the token and get an access token!
            var optionsForAcessToken = {
                url: url.format({
                    pathname: globalOptions.googleTokenInfoEndpoint,
                    query: {
                        id_token: idToken
                    }
                }),
                method: 'GET',
                json: true
            };

            request(optionsForAcessToken,
                function(error, response, body) {
                    if (error) {
                        console.log('problem with token validation request: ' + error.message);
                        callback(error);
                        return;
                    }

                    if (body.error) {
                        msg = 'problem with token validation: ' + body.error_description;
                        callback(new Error(msg));
                        return;

                    }

                    if (!body.user_id) {
                        msg = 'problem with token validation: No USER_ID';
                        callback(new Error(msg));
                        return;
                    }

                    if (body.audience !== globalOptions.appClientID) {
                        msg = 'problem with token validation: Audience does not match CLIENT_ID';
                        callback(new Error(msg));
                        return;
                    }

                    if (!body.email_verified) {
                        msg = 'Unable to get user email from token validation: ';
                        console.log(msg);
                        callback(new Error(msg));
                        return;

                    }

                    if (!body.email) {
                        msg = 'Unable to get user email from token validation: ';
                        console.log(msg);
                        callback(new Error(msg));
                        return;
                    }

                    // var user = {
                    //     email: body.email
                    // };



                    var treatModelError = function(err) {
                        msg = 'Error when checking zideco bases for user: ' + err;
                        console.log(msg);
                        callback(new Error(msg));
                        return;
                    };


                    //Validate that user is a valid "zideco user" and complement user data from our stores.
                    var findOptions = {
                        identifier: body.email
                            // ,
                            // autoFetchNames: ['roles']
                    };

                    //We are only going to check in the ALIASES, because even default identifier stays in alias.
                    model.ZidecoUserAlias.one({
                        identifier: 'raul@zideco.org'
                    }, {
                        // autoFetch: true,
                        // autoFetchNames: ['user']
                    }, function(err, user) {
                        console.log('user: ' + JSON.stringify(user));
                    });

                    //Find one alias.
                    model.ZidecoUserAlias.one(findOptions, function(err, userAlias) {
                        if (err) {
                            treatModelError(err);
                            return;
                        }
                        if (_.isEmpty(userAlias)) {
                            msg = 'User ' + body.email + 'is not a valid ziedeco user';
                            console.log(msg);
                            callback(new Error(msg));
                            return;
                        }

                        //Check that user is valid.
                        if (!userAlias.user.isValid()) {
                            msg = 'User ' + body.email + 'is not valid!';
                            console.log(msg);
                            callback(new Error(msg));
                            return;
                        }



                        //TODO: Check other stuff here.

                        //All checks passed. Return valid user in all his glory!
                        model.ZidecoUser.one({
                            id: userAlias.user.id
                        }, {
                            autoFetchNames: ['roles', 'aliases']
                        }, function(err, user) {
                            if (err) {
                                treatModelError(err);
                                return;
                            }

                            callback(null, user, body);
                        });




                    });




                });


        });
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
