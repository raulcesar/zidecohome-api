'use strict';
var conf = require('../config/conf').get(); //Objeto de configuração... varias entradas, baseada no process.env.NODE_ENV (PROD, DEV, etc.)
var models = require('../models')(conf);
var createUsers = require('./createUsers');







models.sequelize.sync({
    force: true
}).then(function() {
    //Create authorizedSchedule
    models.AuthorizedSchedule.create({
        dayStart: 1,
        dayFinish: 5,
        hourStart: 7,
        hourFinish: 19,
        minuteStart: 0,
        minuteFinish: 0,
        description: 'Default Schedule'

    }).then(function(authorizedSchedule) {
        authorizedSchedule.run(models);

        createUsers.run(models, authorizedSchedule);
    });





});
