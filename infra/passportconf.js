'use strict';
// load all the things we need
//var LocalStrategy   = require("passport-local").Strategy;
//var CasStrategy = require("../passport-kd-cas/lib").Strategy;
//var GoogleStrategy = require("passport-google").Strategy;
//var GooglePlusStrategy = require("passport-google-plus");

var GoogleStrategy = require('../passport-oauth2-clientside/lib').Strategy;


//var User = require("../model/user");

//Expoe funcao de configuração:
// expose this function to our app using module.exports
module.exports = function(passport, models) {

    // =========================================================================
    //                   setup do passport para sessao.
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        //Vamos serializar o usuário inteiro.
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        var zidecoUser = models.ZidecoUser.build(user);
        // user = new Usuario(user);
        done(null, zidecoUser);


    });

    //    // =========================================================================
    //    //            GoogleStrategy
    //    // =========================================================================
    //  passport.use("google", new GoogleStrategy({
    //              returnURL: "http://www.rault.org:3030/auth/google/return",
    //              realm: "http://www.rault.org:3030/"
    //          },
    //          function(identifier, profile, done) {
    //              User.findOrCreate({ openId: identifier }, function(err, user) {
    //                  done(err, user);
    //              });
    //          }
    //      )
    //
    //
    //  );

    // =========================================================================
    //                      estrategia google (criada por nos)
    // =========================================================================
    passport.use('googleoauth2clientside', new GoogleStrategy());


    //    // =========================================================================
    //    //            GooglePlusStrategy
    //    // =========================================================================
    //    passport.use("googleplus", new GooglePlusStrategy({
    //            clientId: "965550095210-5l68e76451uj3cjau9oahkmov3l9lk2l.apps.googleusercontent.com",
    //            clientSecret: "_rqDu5zzkKvmqja_la8UPhBd"
    //        },
    //        function(tokens, profile, done) {
    //            // Create or update user, call done() when complete...
    //            var user = {profile: profile, tokens: tokens};
    //            done(null, user);
    //        }
    //    ));

    // =========================================================================
    //                      estrategia CAS (criada por nos)
    // =========================================================================
    //  passport.use("kdcas-validate", new CasStrategy());


    // =========================================================================
    //                      estrategia local... so para testar.
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called "local"

    //  passport.use("local-login", new LocalStrategy({
    //      // by default, local strategy uses username and password, we will override with email
    //      usernameField : "email",
    //      passwordField : "password",
    //      passReqToCallback : true // allows us to pass back the entire request to the callback
    //    },
    //    function(req, email, password, done) {
    //      //Esta é a funcao de "verificacao" usado pela LocalStrategy
    //      //finge que esta validando o password
    //      var user;
    //      if (password === "senha") {
    //        user = new User(email, "999", "");
    //        return done(null, user);
    //      }
    //
    //      return done(null, false);
    //    }));


};
