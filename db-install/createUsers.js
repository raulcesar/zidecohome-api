'use strict';
var createTimeEntries = require('./createTimeEntries');
var createNocturnalSessions = require('./createNocturnalSessions');
var moment = require('moment');


var createUsers = function(models, authorizedSchedule) {
    var beginingOfTime = moment('01-01-1990', 'DD-MM-YYYY');
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
            aliasDefaultSU.setUser(su, {
                save: false
            });
            aliasDefaultSU.save();

            su.addRole(suRole, {
                startDate: beginingOfTime
            });
        });

        //Create user RAUL:
        models.ZidecoUser.create({
            identifier: 'raul@zideco.org',
            disabled: false
        }).then(function(newUser) {
            //Add default schedule to raul:
            newUser.addSchedule(authorizedSchedule, {
                validSince: beginingOfTime
            });



            //Create some aliases for raul...
            var aliasDefaultRaul = models.ZidecoUserAlias.build({
                identifier: 'raul@zideco.org'
            });
            aliasDefaultRaul.setUser(newUser, {
                save: false
            });
            aliasDefaultRaul.save();

            var aliasGmail = models.ZidecoUserAlias.build({
                identifier: 'raul.teixeira@gmail.com'
            });
            aliasGmail.setUser(newUser, {
                save: false
            });
            aliasGmail.save();


            var aliasGitHub = models.ZidecoUserAlias.build({
                identifier: 'raulcesar'
            });
            aliasGitHub.setUser(newUser, {
                save: false
            });
            aliasGitHub.save();


            //Create time entries for this user
            createTimeEntries.run(models, newUser);

            createNocturnalSessions.run(models, newUser);

            //add newuser to SU role
            newUser.addRole(suRole, {
                startDate: beginingOfTime
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
            aliasDefaultRaul.setUser(newUser, {
                save: false
            });
            aliasDefaultRaul.save();

            var aliasGmail = models.ZidecoUserAlias.build({
                identifier: 'yara.teixeira@gmail.com'
            });
            aliasGmail.setUser(newUser, {
                save: false
            });
            aliasGmail.save();
        });


    });

};

module.exports = {
    run:createUsers
};