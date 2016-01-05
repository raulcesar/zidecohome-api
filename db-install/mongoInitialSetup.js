'use strict';
var _ = require('lodash');
var moment = require('moment');
var args = require('minimist')(process.argv.slice(2));
var configEnv = args.configenv || args._[0] || 'develop';


//Create express server.
var conf = require('../config/conf').get(configEnv); //Objeto de configuração... varias entradas, baseada no process.env.NODE_ENV (PROD, DEV, etc.)
var models = require('../mdbModel')(conf);
//Include raul.

var begining = moment('2015/01/01', 'YYYY/MM/DD').toDate();
var users = [
    {
        identifier: 'raul@zideco.org',
        disabled: false,
        aliases: [
            'raul.teixeira@gmail.com',
            'raul.teixeira@camara.gov.br'
        ],
        roles: [{
            code: 'SUPERUSER',
            startDate: begining
        }]
    }, {
        identifier: 'aline@zideco.org',
        disabled: false,
        aliases: ['aline.teixeira@gmail.com']
    }
];

models.models.user.remove({
    identifier: 'raul@zideco.org'
}, function(err) {
    if (err) {
        console.log('deu pau: ' + err);
    }
    console.log('should have removed all users!');
});

models.models.user.create(users).then(function(ret) {
    console.log('in callback');
    console.log('users: ' + JSON.stringify(ret));

});

// models.models.user.find({
//     identifier: 'raul@zideco.org',
//     disabled: false,
//     aliases: [
//         'raul.teixeira@gmail.com',
//         'raul.teixeira@camara.gov.br'
//     ]
// }, function(err, docs) {
//     _.each(docs)
//     console.log(JSON.stringify(docs));
// });
