'use strict';
var conf = require('../config/conf').get('localhost'); //Objeto de configuração... varias entradas, baseada no process.env.NODE_ENV (PROD, DEV, etc.)
var moment = require('moment');
var _ = require('lodash');
// var authenticationUtil = require('./infra/authenticationUtil')(conf);




var models = require('../models'); //ORM will be needed for passport 

models(conf, function(m) {
    console.log('hello');

    // var newRecord = {
    //     identifier: 'su',
    //     disabled: false
    // };
    // newRecord.id = 1;
    // newRecord.name = "John"

    m.ZidecoUser.one({identifier: 'raul@zideco.org'}, function(err, user) {
        user.getAliases(function(err, aliases) {
            console.log('aliaes: ' + aliases.length);

        });

        user.getRoles(function(err, roles) {
            console.log('roles: ' + roles.length);
            roles.forEach(function(role) {
                console.log('Role ' + role.code + ' since ' + moment(role.startDate).format('DD-MM-YYYY HH:mm') +
                    ' until ' + 
                    (_.isEmpty(role.endDate) ? 'ETERNITY' : moment(role.endDate).format('DD-MM-YYYY HH:mm')));

            });

        });

        user.getTimeentries(function(err, timeentries) {
            console.log('timeentries: ' + timeentries.length);
            timeentries.forEach(function(timeEntry) {
                console.log(moment(timeEntry.entryTime).format('DD-MM-YYYY HH:mm'));

            });
        });

    });


// sELECT "t1"."code", "t1"."description", "t1"."id", "t2"."startDate", "t2"."endDate" FROM "UserRole" "t1" JOIN "UserRole_users" "t2" ON "t2"."userrole_id" = "t1"."id" WHERE "t2"."users_id" = 2    
// select * from "userXrole";
// select * from "UserRole_users"

// INSERT INTO "userXrole" ("startDate", "zidecouser_id", "roles_id") VALUES ('1990-01-01T00:00:00.000Z', 2, 1)
    // m.ZidecoUser.create(newRecord, function(err, user) {
    //     if (err) {
    //         console.log('deu pau: ' + err);
    //     }
    //     console.log('identifier: ' + user.identifier);
    //     console.log('id: ' + user.id);

    //     //create the alias... por enquanto nao tem chave est.

    //     m.ZidecoUserAlias.create({
    //         identifier: 'su-alias'
    //     }, function(err, alias) {
    //         alias.setUser(user, function(err, arg2) {
    //             if (err) {
    //                 console.log('pau: ' + err);
    //             }
    //             m.db.close();
    //         });
    //         // user.addAlias(alias);
    //         // user.save(function(err, arg2) {
    //         //     if (err) {
    //         //         console.log('pau: ' + err);
    //         //     }
    //         //     m.db.close();

    //         // });
    //     });



    //     // params.message_id = message.id;
});




// select * from "ZidecoUser"


// var startDate = moment().startOf('month').toDate();
// var endDate = moment().startOf('month').add(1, 'months').toDate();

// var query = {
//     where: {
//         validSince: {
//             gte: startDate,
//             lt: endDate
//         },
//         userId: 2
//     },
//     include: [{
//         model: models.ZidecoUser,
//         as: 'user'
//     }]

// };

// query = {
//     where: {
//         id: 2
//     }
// };


// // "attributes" : [],
// //         "include" : [
// //             {"model" : User, "include" : [
// //                 { "model" : db.BorrowedBook, "where" : {"returnedAt" : null } }
// //             ]}
// //         ]

// var querySchedule = {
//     where: {
//         // UserXSchedule: {
//             validSince: {
//                 gte: startDate,
//                 lt: endDate
//             }
//         // }
//     }
// };
// var completeUserQuery = {
//     where: {
//         id: 2
//     },
//     include: [{
//         model: models.AuthorizedSchedule,
//         as: 'schedules',
//         through: {
//             model: models.UserXRole,
//             scope: {}
//         },
//         indlude: [{
//             model: models.AuthorizedSchedule,
//             where: querySchedule
//         }]
//     }]
// };



// // completeUserQuery = {
// //     where: {
// //         id: 2
// //     },
// //     include: [{
// //         model: models.AuthorizedSchedule,
// //         as: 'schedules'
// //     }]
// // };


// // models.ZidecoUser.find(completeUserQuery).then(function(user) {
// //     var horarios = user.schedules;
// //     var horarios = user.getSchedules().then(function(horarios) {
// //         console.log('ok');
// //     });


// // });



// // //This workss:
// // completeUserQuery = {
// //     where: {
// //         id: 1
// //     },
// //     include: [{
// //         model: models.TagMama,
// //         as: 'tigs'
// //     }]
// // };


// // models.Post.find(completeUserQuery).then(function(user) {
// //  console.log('ok');

// // });
