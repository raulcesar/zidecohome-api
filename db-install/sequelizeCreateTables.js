'use strict';
var conf = require('../config/conf').get(); //Objeto de configuração... varias entradas, baseada no process.env.NODE_ENV (PROD, DEV, etc.)
var models = require('../models')(conf);
var moment = require('moment');


models.sequelize.sync({
    force: true
}).then(function() {
    //Create first user row:
    models.UserRole.create({
        code: 'SU',
        description: 'Super User Role'
    }).then(function(suRole) {
        //Create user SU:
        models.ZidecoUser.create({
            identifier: 'su',
            disabled: false
        }).then(function(su) {
            var data = moment('01-01-1990', 'DD-MM-YYYY');
            su.addRole(suRole, {
                startDate: data
            });
        });
    });


    var entries = [
        //Lets put in some "invalids"
        moment('04-05-2015 06:05', 'DD-MM-YYYY HH:mm'), //INVALID




        moment('04-05-2015 08:05', 'DD-MM-YYYY HH:mm'),
        moment('04-05-2015 18:24', 'DD-MM-YYYY HH:mm'),


        moment('05-05-2015 06:05', 'DD-MM-YYYY HH:mm'),//INVALID
        moment('05-05-2015 06:02', 'DD-MM-YYYY HH:mm'),//INVALID
        
        moment('05-05-2015 08:38', 'DD-MM-YYYY HH:mm'),
        moment('05-05-2015 14:28', 'DD-MM-YYYY HH:mm'),
        moment('05-05-2015 15:21', 'DD-MM-YYYY HH:mm'),
        moment('05-05-2015 19:08:32', 'DD-MM-YYYY HH:mm:ss'), //Entrada da noturna. Deve ser duplicado.
        moment('05-05-2015 21:01', 'DD-MM-YYYY HH:mm'), //Saida da noturna
        moment('06-05-2015 00:02', 'DD-MM-YYYY HH:mm'),//POSSIBLE CAP... INVALID 



        moment('06-05-2015 07:56', 'DD-MM-YYYY HH:mm'),
        moment('06-05-2015 11:51', 'DD-MM-YYYY HH:mm'),
        moment('06-05-2015 13:34', 'DD-MM-YYYY HH:mm'),
        moment('06-05-2015 19:05', 'DD-MM-YYYY HH:mm')
    ];
    //Create time entries
    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        models.TimeEntry.create({
            entryTime: entry.toDate(),
            origin: 'MANUAL'
        });
    }

    // TimeEntryServices

});
