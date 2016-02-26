'use strict';

var _ = require('lodash');
var Q = require('q');


var cookies = {};
var connectToZideco = function() {
    var deferred = Q.defer();
    var nan = require('nano')('http://vubuntuserver:5984');
    nan.auth('raul', 'kline', function(err, body, headers) {
        if (err) {
            deferred.reject(err);
            return;
        }

        if (headers && headers['set-cookie']) {
            cookies.user = headers['set-cookie'];
        }

        var ret = require('nano')({
            url: 'http://vubuntuserver:5984',
            cookie: cookies.user
        });

        deferred.resolve(ret);
    });

    return deferred.promise;
};


var successConnectDB = function(nano) {
    console.log('Vou chamar initDatabase. nano: ' + nano);

    // nano.session(function(err, session) {
    //     if (err) {
    //         return console.log('oh noes!');
    //     }

    //     console.log('user is %s and has these roles: %j',
    //         session.userCtx.name, session.userCtx.roles);
    // });



    var initDabase = function() {
        var deferred = Q.defer();
        console.log('Vou chamar nano.db.destroy ');


        nano.db.destroy('zidecofinance', function(err, body) {
            console.log('Tried to destroy... err: ' + err);
            if (err) {
                deferred.reject(err);
                return;
            }

            nano.db.create('zidecofinance', function(err, body) {
                if (err) {
                    deferred.reject(err);
                    return;
                }
                deferred.resolve(body);
            });
        });
        return deferred.promise;

    };

    initDabase().then(function() {
        var zidecoFinanceDB = nano.use('zidecofinance');
        var roles = [{
            code: 'SU',
            description: 'Super User Role'
        }, {
            code: 'PLAINUSER',
            description: 'Normal Zideco User'
        }];

        var users = [{
            'identifier': 'raul@zideco.org',
            'disabled': false,
            'aliases': ['raul@zideco.org', 'raul.teixeira@gmail.com'],
            'rolecodes': ['SU', 'PLAINUSER']

        }, {
            'identifier': 'su',
            'disabled': false,
            'aliases': ['su'],
            'rolecodes': ['SU']

        }, {
            'identifier': 'yara@zideco.org',
            'disabled': false,
            'aliases': ['yara@zideco.org', 'yara.teixeira@gmail.com'],
            'rolecodes': ['SU']

        }];
        // var suRoleID, plainUserID;

        _.each(roles, function(role) {
            zidecoFinanceDB.insert(role, function(err, body) {
                if (err) {
                    console.log('Error inserting role: ' + err);
                    return;
                }
                console.log('role ' + role.code + ': ' + body.id);
            });
        });

        _.each(users, function(user) {
            zidecoFinanceDB.insert(user, function(err, body) {
                if (err) {
                    console.log('Error inserting user: ' + err);
                    return;
                }
                console.log('user ' + user.identifier + ': ' + body.id);
            });
        });
    }, function(err) {
        console.log('Error initializing DB: ' + err);
    });
};

connectToZideco().then(
    successConnectDB,
    function(err) {
        console.log('Error connecting to DB: ' + err);
    });




// var populateDB = function() {
//     var zidecoFinanceDB = nano.use('zidecofinance');
//     var roles = [{
//         code: 'SU',
//         description: 'Super User Role'
//     }, {
//         code: 'PLAINUSER',
//         description: 'Normal Zideco User'
//     }];

//     var users = [{
//         'identifier': 'raul@zideco.org',
//         'disabled': false,
//         'aliases': ['raul@zideco.org', 'raul.teixeira@gmail.com'],
//         'rolecodes': ['SU', 'PLAINUSER']

//     }, {
//         'identifier': 'su',
//         'disabled': false,
//         'aliases': ['su'],
//         'rolecodes': ['SU']

//     }, {
//         'identifier': 'yara@zideco.org',
//         'disabled': false,
//         'aliases': ['yara@zideco.org', 'yara.teixeira@gmail.com'],
//         'rolecodes': ['SU']

//     }];
//     // var suRoleID, plainUserID;

//     _.each(roles, function(role) {
//         zidecoFinanceDB.insert(role, function(err, body) {
//             suRoleID = body._id;
//         });
//     });

//     _.each(users, function(user) {
//         console.log(user.identifier);
//     });


//     // zidecoFinanceDB.insert(suRole, function(err, body) {
//     //     suRoleID = body._id;
//     // });


//     // --Create roles
//     // curl -X POST http://vubuntuserver:5984/zidecofinance/ -d '{"code": "SU", "description": "Super User Role"}' -H "Content-Type: application/json"
//     // curl -X POST http://vubuntuserver:5984/zidecofinance/ -d '{"code": "PLAINUSER", "description": "Plain User Role"}' -H "Content-Type: application/json"


//     // --Create users
//     // curl -X POST http://vubuntuserver:5984/zidecofinance/ -d '{"identifier": "raul@zideco.org", "disabled": false, "aliases": ["raul@zideco.org", "raul.teixeira@gmail.com"], "rolecodes": ["SU", "PLAINUSER"]}' -H "Content-Type: application/json"

//     // curl -X POST http://vubuntuserver:5984/zidecofinance/ -d '{"identifier": "yara@zideco.org", "disabled": false, "aliases": ["yara@zideco.org", "yara.teixeira@gmail.com"], "rolecodes": ["PLAINUSER"]}' -H "Content-Type: application/json"

//     // curl -X POST http://vubuntuserver:5984/zidecofinance/ -d '{"identifier": "su", "disabled": false, "aliases": ["su"], "rolecodes": ["SU"]}' -H "Content-Type: application/json"

// };
