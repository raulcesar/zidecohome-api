'use strict';

//TODO: o codigo relativo a sessao tera que ser refatorado de forma a ser diferenciado para ambiente de desenvolvimento e producao.


exports.setup = function setup(app, conf, passport) {
    var mysql = require('mysql'),
        express = require('express')
        //    , log = require('npmlog')
        ,
        session = require('express-session'),
        cookieParser = require('cookie-parser')(),
        path = require('path')

        //    , RedisStore = require('connect-redis')(session)
        //    , redisClient = require('redis').createClient()
        //    , CAS = require('cas')


        ,
        pool = mysql.createPool({
            host: conf.db.mysql.host,
            user: conf.db.mysql.user,
            password: conf.db.mysql.password,
            database: conf.db.mysql.database,
            port: conf.db.mysql.port
        })

        ,
        knex = require('knex')({
            client: 'mysql',
            connection: {
                host: conf.db.mysql.host,
                user: conf.db.mysql.user,
                password: conf.db.mysql.password,
                database: conf.db.mysql.database,
            }
        })

        ,bookshelf = require('bookshelf')(knex)


        ,sessionStore = new session.MemoryStore();


    //  Loga REDIS startup.
    //  redisClient
    //    .on('ready', function() { log.info('REDIS', 'ready'); })
    //    .on('error', function(err) { log.error('REDIS', err.message); });


    //inclui middlewares da aplicacao express...
    app.use(require('morgan')('dev')); //log
    app.use(require('compression')());
    app.use(require('body-parser').urlencoded({
        extended: true
    }));

    app.use(require('errorhandler')(conf.application.errorHandler));
    //todo: put in server.js to test with io.sockets.
    app.use(cookieParser);

    //Create session
    session = session({
        store: sessionStore,
        secret: conf.application.sessionsecret,
        resave: true,
        saveUninitialized: true
    });
    app.use(session);



    //TODO: inclui redis.
    //  app.use(session({
    //    secret: 'bla1@fds#hjohnny%1!@'
    ////    ,store: new RedisStore({
    ////      client: redisClient
    ////    })
    //  }));
    app.use(passport.initialize());
    app.use(passport.session());




    //Permite CORS (development only)
    //  app.configure('development')
    //  if (app.settings.env == conf.validEnvs.dev) {
    app.use(require('./corsmiddleware')()); //log
    //  }

    //Inclui um middleware para tratar para... eu acho que mysql e cache... por hora não vamos usar cache, entao comentei o cache e store...
    app.use(function(req, res, next) {
        //Seta instancia do bookshelf.
        req.bookshelf = bookshelf;


        // req.mysql = pool;
        //    req.cache   = require('memoizee');
        //    req.store   = app.locals;
        next();
    });

    //  app.use(function(req, res, next) {
    //    console.log('req.user' + req.user);
    //    res.header('kd-usuario' , {user: req.user} );
    //    next();
    //  });


    //Middleware para servir arquivos estaticos... Podemos deixar aqui ou podemos possivelmente
    //deixar o NGINX servidor os arquivos.
    var directory = path.join(__dirname, '../staticfiles');
    console.log('Serving static files from: ' + directory);
    app.use('/file', express.static(directory));


    //Put sessionStore on app object.
    //  app.sessionStore = sessionStore;

    //hidrate config object with necessary middlewares
    conf.session = session;
    conf.cookieParser = cookieParser;

};