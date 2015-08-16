/**
 * Created by raul on 02/10/2014.
 */

'use strict';
var express = require('express'), //Express framework
    middleware = require('./infra/middleware'),
    iosocketserver = require('./infra/socketserver'),

    router = require('./infra/router'),
    args = require('minimist')(process.argv.slice(2)),
    passport = require('passport');


/// error handlers
process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err.stack);
});
///// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//});


//// production error handler
//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//        message: err.message,
//        error: {}
//    });
//});


var configEnv = args.configenv || app.settings.env;
//Create express server.
var app = express();
var conf = require('./config/conf').get(configEnv); //Objeto de configuração... varias entradas, baseada no process.env.NODE_ENV (PROD, DEV, etc.)
var authenticationUtil = require('./infra/authenticationUtil')(conf);
var zidecoUtils = require('./infra/zidecoUtils');
// var orm = require('./submodules/orm/lib/ORM');

app.set('authenticationUtil', authenticationUtil);
app.set('zUtils', zidecoUtils);
app.set('conf', conf);


// var ormConnectOpts = {
//     host: conf.db.postgres.host,
//     database: conf.db.postgres.database,
//     user: conf.db.postgres.user,
//     password: conf.db.postgres.password,
//     protocol: 'postgres',
//     // socketPath: '/var/run/mysqld/mysqld.sock',
//     port: conf.db.postgres.port,
//     query: {
//         pool: true,
//         debug: true
//     }
// };


//We need to connect and define our modle before we can continue.
var models = require('./models');
models(conf, function(m) {
    app.set('ormmodels', m);
    require('./infra/passportconf')(passport, m); // pass passport for configuration


    //Start server
    var http = require('http');
    var server = http.createServer(app);


    //Configure connect 'middleware' (session, etc.)
    middleware.setup(app, conf, passport);

    //configure and run socket.io server
    iosocketserver.setup(conf, server);


    //Configure routes
    router.run(app, conf, passport);



    //models.sequelize.sync().success(function () {
    //Comeca a escutar
    server.listen(conf.server.port, function() {
        if (app.settings.env === conf.validEnvs.dev) {
            console.log('app.env: ' + app.settings.env);
            console.log('process.env.NODE_ENV: ' + process.env.NODE_ENV);
        }

        console.log('I stand ready for subjugation (on port ' + conf.server.port + '), my master.');
    });


    console.log('calling orm express');
});


// app.use(orm.express(ormConnectOpts, {
//     define: function(db, models, next) {
//         models.db = db;
//         require('./models')({
//             type: 'middleware',
//             models: models
//         }); //ORM will be needed for passport 
//         //Define all models and 
//         app.set('ormmodels', models);
//         console.log('calling orm express');

//         // models.person = db.define("person", {...
//         // });
//         next();
//     }
// }));
