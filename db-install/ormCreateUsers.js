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

var createUsers = function(m, authorizedSchedule) {
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
            var data = moment().toDate();

                // m.TimeEntry.create({
                //     user_id: raulUser.id,
                //     entryTime: data
                // }, function(err) {
                //     console.log('porra' + err);
                // });

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
            // suRole.extra = {startDate: beginingOfTime};
            // raulUser.setRoles([suRole], doNothingCB);
            // raulUser.getR
            // suRole.addUser(raulUser, {startDate: beginingOfTime});
            raulUser.addRole(suRole, {startDate: beginingOfTime});

            //Create time entries for this user

            createTimeEntries.run(m, raulUser);

        });


        //     createNocturnalSessions.run(models, newUser);



        // //Create user YARA:
        // models.ZidecoUser.create({
        //     identifier: 'yara@zideco.org',
        //     disabled: false
        // }).then(function(newUser) {
        //     //Create some aliases for raul...
        //     var aliasDefaultRaul = models.ZidecoUserAlias.build({
        //         identifier: 'yara@zideco.org'
        //     });
        //     aliasDefaultRaul.setUser(newUser, {
        //         save: false
        //     });
        //     aliasDefaultRaul.save();

        //     var aliasGmail = models.ZidecoUserAlias.build({
        //         identifier: 'yara.teixeira@gmail.com'
        //     });
        //     aliasGmail.setUser(newUser, {
        //         save: false
        //     });
        //     aliasGmail.save();
        // });


    });

};

module.exports = {
    run: createUsers
};
