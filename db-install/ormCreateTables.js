'use strict';
var conf = require('../config/conf').get('localhost'); //Objeto de configuração... varias entradas, baseada no process.env.NODE_ENV (PROD, DEV, etc.)
var moment = require('moment');
// var authenticationUtil = require('./infra/authenticationUtil')(conf);




var models = require('../models'); //ORM will be needed for passport 
var createUsers = require('./ormCreateUsers');

models(conf, function(m) {
    m.db.drop(function() {
        m.db.sync(function() {
            console.log('hello');
            createUsers.run(m);
            //Create roles.
            // m.db.close();


            // m.ZidecoUser.create({
            //     identifier: 'su',
            //     disabled: false
            // }, function(err, user) {
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
            // });



        });
    });
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
