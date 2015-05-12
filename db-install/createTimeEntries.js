'use strict';
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
        moment('07-05-2015 14:18', 'DD-MM-YYYY HH:mm'),
        moment('07-05-2015 19:08', 'DD-MM-YYYY HH:mm'),


        moment('08-05-2015 08:11', 'DD-MM-YYYY HH:mm'),
        moment('08-05-2015 11:53', 'DD-MM-YYYY HH:mm'),
        moment('08-05-2015 13:32', 'DD-MM-YYYY HH:mm'),
        moment('08-05-2015 18:25', 'DD-MM-YYYY HH:mm'),

        moment('11-05-2015 08:03', 'DD-MM-YYYY HH:mm'),
        moment('11-05-2015 11:55', 'DD-MM-YYYY HH:mm'),
        moment('11-05-2015 15:19', 'DD-MM-YYYY HH:mm'),
        moment('11-05-2015 19:00', 'DD-MM-YYYY HH:mm'),

        moment('12-05-2015 07:59', 'DD-MM-YYYY HH:mm')

    ];


    //NO dia 04-05, deve-se incluir "registros intervencao" às 12:00 e 12:30
    var manualEntries = [
        //Lets put in some "invalids"
        // moment('04-05-2015 06:05', 'DD-MM-YYYY HH:mm'), //INVALID(for tests... did not really register this!)
        moment('04-05-2015 12:00', 'DD-MM-YYYY HH:mm'),
        moment('04-05-2015 12:30', 'DD-MM-YYYY HH:mm'),
    ];


    var logCreation = function(entry) {
        console.log('entry created: ' + entry);
    };

    var logErrorOnCreation = function(err) {
        console.log('Deu pau: ' + err);
    };
    var insertqtd = 0;
    var i;
    var entry;
    var timeEntry;
    //Create time entries
    for (i = 0; i < entries.length; i++) {
        insertqtd++;
        entry = entries[i];
        // models.TimeEntry.create({
        //     entryTime: entry.toDate(),
        //     origin: 'MANUAL',
        //     user: user
        // }).then(logCreation, logErrorOnCreation);
        timeEntry = models.TimeEntry.build({
            entryTime: entry.toDate(),
            origin: 'transposed'
        });
        timeEntry.setUser(user, {
            save: false
        });
        timeEntry.save().then(logCreation, logErrorOnCreation);
    }

    for (i = 0; i < manualEntries.length; i++) {
        insertqtd++;
        entry = manualEntries[i];
        // models.TimeEntry.create({
        //     entryTime: entry.toDate(),
        //     origin: 'MANUAL',
        //     user: user
        // }).then(logCreation, logErrorOnCreation);
        timeEntry = models.TimeEntry.build({
            entryTime: entry.toDate(),
            origin: 'manual'
        });
        timeEntry.setUser(user, {
            save: false
        });
        timeEntry.save().then(logCreation, logErrorOnCreation);
    }

    console.log('Entered: ' + insertqtd);
};


module.exports = {
    run:createTimeEntries
};
