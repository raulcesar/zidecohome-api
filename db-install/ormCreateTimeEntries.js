'use strict';
var moment = require('moment');

var doNothingCB = function(err) {
    if (err) {
        console.log('Error: ' + err);
    }
    // console.log(obj);
    return;
};


var createTimeEntries = function(m, user) {
    var entries = require('./timeEntrys.js');


    //NO dia 04-05, deve-se incluir "registros intervencao" às 12:00 e 12:30
    var manualEntries = [
        //Lets put in some "invalids"
        // moment('04-05-2015 06:05', 'DD-MM-YYYY HH:mm'), //INVALID(for tests... did not really register this!)
        moment('04-05-2015 12:00', 'DD-MM-YYYY HH:mm'),
        moment('04-05-2015 12:30', 'DD-MM-YYYY HH:mm'),
    ];


    var insertqtd = 0;
    var i;
    var entry;

    //Create time entries
    for (i = 0; i < entries.length; i++) {
        insertqtd++;
        entry = entries[i];

        m.TimeEntry.create({
            user_id: user.id,
            entryTime: entry.toDate()
        }, doNothingCB);
    }

// select * from "TimeEntry";
    for (i = 0; i < manualEntries.length; i++) {
        insertqtd++;
        entry = manualEntries[i];
        
        m.TimeEntry.create({
            user_id: user.id,
            entryTime: entry.toDate(),
            origin: 'manual'
        }, doNothingCB);

    }

    console.log('Entered: ' + insertqtd);
};


module.exports = {
    run:createTimeEntries
};
