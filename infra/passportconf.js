// load all the things we need
//var LocalStrategy   = require('passport-local').Strategy;
var CasStrategy = require('../passport-kd-cas/lib').Strategy;

var User = require('../model/user');

//Expoe funcao de configuração:
// expose this function to our app using module.exports
module.exports = function(passport) {


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
    done(null, user);
  });




  // =========================================================================
  //                      estrategia CAS (criada por nos)
  // =========================================================================
  passport.use('kdcas-validate', new CasStrategy());


  // =========================================================================
  //                      estrategia local... so para testar.
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

//  passport.use('local-login', new LocalStrategy({
//      // by default, local strategy uses username and password, we will override with email
//      usernameField : 'email',
//      passwordField : 'password',
//      passReqToCallback : true // allows us to pass back the entire request to the callback
//    },
//    function(req, email, password, done) {
//      //Esta é a funcao de "verificacao" usado pela LocalStrategy
//      //finge que esta validando o password
//      var user;
//      if (password === 'senha') {
//        user = new User(email, '999', '');
//        return done(null, user);
//      }
//
//      return done(null, false);
//    }));


}

