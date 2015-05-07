'use strict';
var conf = require('../config/conf').get(); //Objeto de configuração... varias entradas, baseada no process.env.NODE_ENV (PROD, DEV, etc.)
var models = require('../models')(conf);
var moment = require('moment');


var createTimeEntries = function(models, user) {
    var entries = [
        //Lets put in some "invalids"
        // moment('04-05-2015 06:05', 'DD-MM-YYYY HH:mm'), //INVALID(for tests... did not really register this!)




        moment('04-05-2015 08:05', 'DD-MM-YYYY HH:mm'),
        moment('04-05-2015 18:24', 'DD-MM-YYYY HH:mm'),


        // moment('05-05-2015 06:05', 'DD-MM-YYYY HH:mm'),//INVALID(for tests... did not really register this!)
        // moment('05-05-2015 06:02', 'DD-MM-YYYY HH:mm'),//INVALID(for tests... did not really register this!)

        moment('05-05-2015 08:38', 'DD-MM-YYYY HH:mm'),
        moment('05-05-2015 14:28', 'DD-MM-YYYY HH:mm'),
        moment('05-05-2015 15:21', 'DD-MM-YYYY HH:mm'),
        moment('05-05-2015 19:08', 'DD-MM-YYYY HH:mm:ss'), //Entrada da noturna. Deve ser duplicado.
        moment('05-05-2015 21:01', 'DD-MM-YYYY HH:mm'), //Saida da noturna
        // moment('06-05-2015 00:02', 'DD-MM-YYYY HH:mm'),//POSSIBLE CAP... INVALID (for tests... did not really register this!)



        moment('06-05-2015 07:56', 'DD-MM-YYYY HH:mm'),
        moment('06-05-2015 11:51', 'DD-MM-YYYY HH:mm'),
        moment('06-05-2015 13:34', 'DD-MM-YYYY HH:mm'),
        moment('06-05-2015 19:05', 'DD-MM-YYYY HH:mm'),
        moment('06-05-2015 21:01', 'DD-MM-YYYY HH:mm'), //Saida da noturna


        moment('07-05-2015 07:49', 'DD-MM-YYYY HH:mm'),
        moment('07-05-2015 12:51', 'DD-MM-YYYY HH:mm'),
        moment('07-05-2015 14:18', 'DD-MM-YYYY HH:mm')


    ];
    var logCreation = function(entry) {
        console.log('entry created: ' + entry);
    };

    var logErrorOnCreation = function(err) {
        console.log('Deu pau: ' + err);
    };
    var insertqtd = 0;
    //Create time entries
    for (var i = 0; i < entries.length; i++) {
        insertqtd ++;
        var entry = entries[i];
        // models.TimeEntry.create({
        //     entryTime: entry.toDate(),
        //     origin: 'MANUAL',
        //     user: user
        // }).then(logCreation, logErrorOnCreation);
        var timeEntry = models.TimeEntry.build({
            entryTime: entry.toDate(),
            origin: 'MANUAL'
        });
        timeEntry.setUser(user, {save: false});
        timeEntry.save().then(logCreation, logErrorOnCreation);
    }
    console.log('Entered: ' + insertqtd);
};

var data = moment('01-01-1990', 'DD-MM-YYYY');
models.sequelize.sync({
    force: true
}).then(function() {
    //Create SuperUser ROLE:
    models.UserRole.create({
        code: 'SU',
        description: 'Super User Role'
    }).then(function(suRole) {
        //Create user SU:
        models.ZidecoUser.create({
            identifier: 'su',
            disabled: false
        }).then(function(su) {
            var aliasDefaultSU = models.ZidecoUserAlias.build({
                identifier: 'su'
            });
            aliasDefaultSU.setUser(su, {save: false});
            aliasDefaultSU.save();

            su.addRole(suRole, {
                startDate: data
            });
        });

        //Create user RAUL:
        models.ZidecoUser.create({
            identifier: 'raul@zideco.org',
            disabled: false
        }).then(function(newUser) {
            //Create some aliases for raul...
            var aliasDefaultRaul = models.ZidecoUserAlias.build({
                identifier: 'raul@zideco.org'
            });
            aliasDefaultRaul.setUser(newUser, {save: false});
            aliasDefaultRaul.save();

            var aliasGmail = models.ZidecoUserAlias.build({
                identifier: 'raul.teixeira@gmail.com'
            });
            aliasGmail.setUser(newUser, {save: false});
            aliasGmail.save();


            var aliasGitHub = models.ZidecoUserAlias.build({
                identifier: 'raulcesar'
            });
            aliasGitHub.setUser(newUser, {save: false});
            aliasGitHub.save();


            //Create time entries for this user
            createTimeEntries(models, newUser);

            //add newuser to SU role
            newUser.addRole(suRole, {
                startDate: data
            });
        });


        //Create user YARA:
        models.ZidecoUser.create({
            identifier: 'yara@zideco.org',
            disabled: false
        }).then(function(newUser) {
            //Create some aliases for raul...
            var aliasDefaultRaul = models.ZidecoUserAlias.build({
                identifier: 'yara@zideco.org'
            });
            aliasDefaultRaul.setUser(newUser, {save: false});
            aliasDefaultRaul.save();

            var aliasGmail = models.ZidecoUserAlias.build({
                identifier: 'yara.teixeira@gmail.com'
            });
            aliasGmail.setUser(newUser, {save: false});
            aliasGmail.save();




            // //add newuser to SU role
            // newUser.addRole(suRole, {
            //     startDate: data
            // });
        });


    });

});
