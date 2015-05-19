'use strict';
var createTimeEntries = require('./ormCreateTimeEntries.js');
var createNocturnalSessions = require('./createNocturnalSessions');
var moment = require('moment');

var doNothingCB = function(err, obj) {
    if (err) {
        console.log('Error: ' + err);
    }
    // console.log(obj);
    return;
};

var createUsers = function(m, defaultSchedule) {
    var beginingOfTime = moment('01-01-1990', 'DD-MM-YYYY').toDate();
    //Create SuperUser ROLE:
    m.UserRole.create({
        code: 'SU',
        description: 'Super User Role'
    }, function(err, suRole) {

        //Create user SU:
        m.ZidecoUser.create({
            identifier: 'su',
            disabled: false
        }, function(err, su) {
            //Create Alias
            m.ZidecoUserAlias.create({
                identifier: 'su'
            }, function(err, alias) {
                alias.setUser(su, doNothingCB);
            });

            console.log(su.roles);

            //Set roles.
            suRole.addUser(su, {startDate: beginingOfTime});
            // su.setRoles([suRole]);

        });

        //Create user RAUL:
        m.ZidecoUser.create({
            identifier: 'raul@zideco.org',
            disabled: false
        }, function(err, raulUser) {
            //Create Aliases
            m.ZidecoUserAlias.create({
                user_id: raulUser.id,
                identifier: 'raul@zideco.org'
            }, doNothingCB);

            m.ZidecoUserAlias.create({
                user_id: raulUser.id,
                identifier: 'raul.teixeira@gmail.com'
            }, doNothingCB);


            // Set roles.
            raulUser.addRole(suRole, {startDate: beginingOfTime});

            // Add default schedule
            raulUser.addAuthorizedSchedule(defaultSchedule, {startDate: beginingOfTime});

           //Create time entries for this user
            createTimeEntries.run(m, raulUser);

        });

        //Create user Yara:
        m.ZidecoUser.create({
            identifier: 'yara@zideco.org',
            disabled: false
        }, function(err, raulUser) {
            //Create Aliases
            m.ZidecoUserAlias.create({
                user_id: raulUser.id,
                identifier: 'yara@zideco.org'
            }, doNothingCB);

            m.ZidecoUserAlias.create({
                user_id: raulUser.id,
                identifier: 'yara.teixeira@gmail.com'
            }, doNothingCB);


            // Set roles.
            raulUser.addRole(suRole, {startDate: beginingOfTime});

           //Create time entries for this user
            // createTimeEntries.run(m, raulUser);

        });

    });

};

module.exports = {
    run: createUsers
};
