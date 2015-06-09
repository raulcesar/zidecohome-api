'use strict';
var conf = require('../config/conf').get('localhost'); //Objeto de configuração... varias entradas, baseada no process.env.NODE_ENV (PROD, DEV, etc.)
var moment = require('moment');
var _ = require('lodash');
// var authenticationUtil = require('./infra/authenticationUtil')(conf);




var models = require('../models'); //ORM will be needed for passport 

var testSave = function(user) {
    user.logintype = 'other';
    user.save(function(err, obj) {
        console.log('salvou usu...' + obj.logintype);
    });
};
//select * from "TimeEntryPeriod"
// delete from "TimeEntryPeriod"
//select * from "TimeEntry" where id >= 1323
//select * from "ServiceRequest"


models(conf, function(m) {
    console.log('hello');

    // var newRecord = {
    //     identifier: 'su',
    //     disabled: false
    // };
    // newRecord.id = 1;
    // newRecord.name = "John"

    //Test removing timeentries.

    // var query = {
    //     user_id: userId,
    //     and: [{
    //         entryTime: orm.gte(startDate)
    //     }, {
    //         entryTime: orm.lt(endDate)
    //     }]
    // };

    //Test saving array of objects...



    // var startDate = moment('01/05/2015', 'DD/MM/YYYY').toDate();
    // var endDate = moment('10/05/2015', 'DD/MM/YYYY').toDate();


    // var startTime = moment('01/05/2015 10:00', 'DD/MM/YYYY HH:mm');
    // var endTime = moment(startTime).add(1, 'hours');

    // var period = {
    //     startTime: startTime.toDate(),
    //     endTime: endTime.toDate(),
    //     dayReference: startDate,
    //     user_id: 2
    // };
    // var orm = m.orm;
    m.TimeEntry.get(1321, function(err, obj) {
        obj.origin = 'scraped';
        obj.save(function(err, newobj) {
            console.log('newobj: ' + newobj);
        });
    });

    // m.db.driver.remove('TimeEntry', {id: 1324}, function(err) {
    //     console.log('error: ' + err);
    // });

    // m.TimeEntry.find({id: 132}).remove(function(err) {
    //     console.log('error: ' + err);
    // });


    // var periodos = [];
    // periodos[10] = '';


    // var periodos = _.fill(new Array(10), _.clone(period));
    //     var periodos = [{
    //         startTime: startTime.toDate(),
    //         endTime: endTime.toDate(),
    //         dayReference: startDate,
    //         user_id: 2
    //     }, {
    //         startTime: startTime.toDate(),
    //         endTime: endTime.toDate(),
    //         dayReference: startDate,
    //         user_id: 2
    //     }];

    // // .create(newRecord

    //     m.TimeEntryPeriod.create(periodos, function(err, data) {

    //         console.log('err: ' + err);

    //     });

    //select * from "TimeEntry";
    // var validOrigins = ['manual', 'imported', 'transposed', 'scraped'];
    // var excludedOrigins = ['manual', 'imported'];
    // var pars = ['unprocessed', 2, startDate, endDate];
    // var originSQL;
    // var originsPars = [];

    // _.each(excludedOrigins, function(origin) {
    //     if (validOrigins.indexOf(origin) >= 0) {
    //         originsPars.push('\'' + origin + '\'');
    //     }
    // });
    // if (!_.isEmpty(originsPars)) {
    //     originSQL = ' and origin not in (' + originsPars.join(', ') + ')';
    // }

    // var sql = 'delete from "' + m.TimeEntry.table + '" where "status" = ? and "user_id" = ? and "entryTime" >= ? and "entryTime" < ? ';
    // sql += originSQL;
    // m.db.driver.execQuery(sql, pars, function(err, data) {
    //     console.log('err: ' + err);
    // });

    // m.TimeEntry.getLastScrapedEntry(2).then(function(maxdata) {
    //     console.log('max  (with number): ' + moment(maxdata).format('DD/MM/YYYY HH:mm'));
    // });

    // m.TimeEntry.getLastScrapedEntry({
    //     user_id: 2
    // }).then(function(maxdata) {
    //     console.log('max: (with object)' + moment(maxdata).format('DD/MM/YYYY HH:mm'));
    // });

    // var query = {
    //     user_id: 2,
    //     and: [{
    //             entryTime: orm.gte(startDate)
    //         }, {
    //             entryTime: orm.lt(endDate)
    //         }
    //     ]
    // };
    // m.TimeEntry.getLastScrapedEntry(query).then(function(maxdata) {
    //     console.log('max: (with complex object)' + moment(maxdata).format('DD/MM/YYYY HH:mm'));
    // });

    // console.log(m.TimeEntry.table);

    // m.ZidecoUser.one({
    //     identifier: 'raul@zideco.org'
    // }, {}, function(err, user) {

    //     var orm = m.orm;
    //     var userId = user.id;
    //     // var query = {
    //     //     user_id: userId,
    //     //     and: [{
    //     //         entryTime: orm.gte(startDate)
    //     //     }, {
    //     //         entryTime: orm.lt(endDate)
    //     //     }]
    //     // };

    //     // m.TimeEntry.find(query).remove(function(err, data) {
    //     //     console.log('Removed entries... ' + err);

    //     // });
    //     // user.getTimeentries().find(query).remove(function(err, data) {
    //     //     console.log('Removed entries... ' + err);

    //     // });
    //     //select * from "TimeEntry"
    //     m.TimeEntry.deleteUserEntriesOnPeriod(userId, startDate, endDate, function(err, data) {
    //         console.log('hello');
    //     });
    //     //     console.log('Removed entries... ' + err);

    //     // });

    //     // testSave(user);
    // });







    // m.ZidecoUserAlias.one({
    //     identifier: 'raul@zideco.org'
    // }, {
    //     // autoFetch: true,
    //     // autoFetchNames: ['user']
    // }, function(err, alias) {
    //     m.ZidecoUser.one({
    //         id: alias.user.id
    //     }, {
    //         autoFetchNames: ['roles', 'aliases']
    //     }, function(err, user) {
    //         if (err) {
    //             console.log('deu pau');
    //             return;
    //         }

    //         console.log('user: ' + JSON.stringify(user));
    //     });
    // });

    // comment.find({ 
    //               inputDate: orm.lt(new Date()),
    //               and: [{inputDate: orm.gte(...) }]
    //        . }, function (...) {})

    // var startDate = moment('01/05/2015', 'DD/MM/YYYY').toDate();
    // var endDate = moment('05/05/2015', 'DD/MM/YYYY').toDate();
    // var orm = m.orm;

    // var conditions = {
    //     user_id: 2,
    //     and: [{entryTime: orm.gte(startDate)}, {entryTime: orm.lt(endDate)}]
    // };
    // m.TimeEntry.find(conditions, function(err, obj) {
    //     console.log('I am here!. obj: ' + obj.length);


    // });



    // m.ZidecoUser.one({
    //     identifier: 'raul@zideco.org'
    // }, function(err, user) {
    //     user.getAliases(function(err, aliases) {
    //         console.log('aliaes: ' + aliases.length);

    //     });

    //     user.getRoles(function(err, roles) {
    //         console.log('roles: ' + roles.length);
    //         roles.forEach(function(role) {
    //             console.log('Role ' + role.code + ' since ' + moment(role.startDate).format('DD-MM-YYYY HH:mm') +
    //                 ' until ' +
    //                 (_.isEmpty(role.endDate) ? 'ETERNITY' : moment(role.endDate).format('DD-MM-YYYY HH:mm')));

    //         });

    //     });

    //     user.getTimeentries(function(err, timeentries) {
    //         console.log('timeentries: ' + timeentries.length);
    //         timeentries.forEach(function(timeEntry) {
    //             console.log(moment(timeEntry.entryTime).format('DD-MM-YYYY HH:mm'));

    //         });
    //     });



    // });


    // sELECT "t1"."code", "t1"."description", "t1"."id", "t2"."startDate", "t2"."endDate" FROM "UserRole" "t1" JOIN "UserRole_users" "t2" ON "t2"."userrole_id" = "t1"."id" WHERE "t2"."users_id" = 2    
    // select * from "userXrole";
    // select * from "UserRole_users"
    // select * from "ZidecoUser"

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
