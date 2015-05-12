'use strict';
var moment = require('moment');


var createNocturnalSessions = function(models, user) {
    var entries = [{
            start: moment('05-05-2015 19:00', 'DD-MM-YYYY HH:mm'),
            end: moment('05-05-2015 21:00', 'DD-MM-YYYY HH:mm')
        },
        {
            start: moment('06-05-2015 19:00', 'DD-MM-YYYY HH:mm'),
            end: moment('06-05-2015 21:00', 'DD-MM-YYYY HH:mm')
        }
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
    var validPeriodAuthorization;
    //Create nocturnal sessions
    for (i = 0; i < entries.length; i++) {
        insertqtd++;
        entry = entries[i];
        validPeriodAuthorization = models.ValidPeriodAuthorization.build({
            startAuthorization: entry.start.toDate(),
            endAuthorization:  entry.end.toDate(),
            description: 'Sessao Noturna'
        });
        validPeriodAuthorization.setUser(user, {
            save: false
        });
        validPeriodAuthorization.save().then(logCreation, logErrorOnCreation);
    }

    console.log('Entered: ' + insertqtd);
};



module.exports = {
    run:createNocturnalSessions
};
