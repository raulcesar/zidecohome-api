'use strict';
var request = require('request').defaults({
    jar: true
});
var cheerio = require('cheerio');
var moment = require('moment');
var _ = require('lodash');
var Q = require('q');
var PhaseController = require('../infra/PhaseController');



var phaseController;
var deferredScrapeEntries;
var scrapingResultObj = {
    messages: [],
    timeEntries: []
};


var scrapingAllDone = function() {
    deferredScrapeEntries.resolve(scrapingResultObj);
};


var $;
var processdata = function(userId, day, data) {
    var msg;
    var dateString, timeString;

    msg = 'Going to scrape page for day ' + day.format('DD/MM/YYYY') + ' for possible time entries ';
    scrapingResultObj.messages.push(msg);

    data.each(function(i, elem) {
        //Every odd item should be a date.

        var test = $(elem).text();

        if (test.indexOf('/') >= 0) {
            dateString = test.trim();
            if ((i % 2) !== 0) {
                msg = 'Probable error trying to scrape date value from day ' + day.format('DD/MM/YYYY') + '. i should be even, but is: ' + i;
                scrapingResultObj.messages.push(msg);
            }
        } else if (test.indexOf(':') >= 0) {
            timeString = test.trim();
            var entryMoment = moment(dateString + ' ' + timeString, 'DD/MM/YYYY hh:mm');

            var timeEntry = {
                entryTime: entryMoment.toDate(),
                origin: 'scraped',
                status: 'unprocessed',
                user_id: userId
            };

            scrapingResultObj.timeEntries.push(timeEntry);

            if ((i % 2) === 0) {
                msg = 'Probable error trying to scrape time value from day ' + day.format('DD/MM/YYYY') + '. i should be odd, but is: ' + i;
                scrapingResultObj.messages.push(msg);
            }
        } else {
            msg = 'Probable error trying to scrape day. Should have only dates and times, but got: ' + test;
            scrapingResultObj.messages.push(msg);
        }
    });

    // _.each(entries, function(entry) {
    //     //Insert into database!
    //     console.log(entry.format('DD/MM/YYYY hh:mm'));
    // });

    phaseController.endPhase('processdayX', scrapingAllDone);
};









var scrapeTimeEntries = function(models, userId, username, password, startDate, endDate) {

    deferredScrapeEntries = Q.defer();
    startDate = moment(startDate);
    endDate = moment(endDate);

    //Try to post login and recieve cookie...
    var loginUrl = 'https://prod2.camara.gov.br/SigespNet/Autenticacao/validarLogonEfetuarLogon.do';
    var pesqRegUrl = 'https://prod2.camara.gov.br/SigespNet/SigespNetUsuario/dadosRegistroEletronicoEfetuarConsulta.do';

    //Find how many days we want to scrape.
    var days = endDate.diff(startDate, 'days');

    var processReturnData = function(dayArg) {
        var day = moment(dayArg);
        scrapingResultObj.messages.push('Called processReturnData function with dayArg: ' + dayArg.format('DD/MM/YYYY'));

        return function(err, httpResponse, body) {
            scrapingResultObj.messages.push('Inside of function created by processReturnData. Day closuer: ' + day.format('DD/MM/YYYY'));

            $ = cheerio.load(body);
            $('#dtListagem').filter(function(obj) {
                var data = $(this).children('tbody').children('tr').children('td');
                processdata(userId, day, data);
            });
        };
    };



    //First, login
    request.post(loginUrl, {
        form: {
            txtLogin: username,
            txtSenha: password
        }
    }, function(err, httpResponse, body) {
        if (err) {
            var errorobj = {
                msg: 'Error on login. Unable to scrape any records: ' + err,
                httpResponse: httpResponse,
                body: body
            };
            deferredScrapeEntries.resolve(errorobj);
            return;
        }

        //Now that we are loged in, lets create the phase controller and get the dates...
        phaseController = new PhaseController(days);


        for (var dayI = 0; dayI < days; dayI++) {
            var dateSubmissionForm = {
                dataRegistroEletronico: startDate.format('DD/MM/YYYY')
            };

            //Because moment "add" will change the state of our startDate, and the request post callback will be called latter,
            //We will create a new object here to mantain the iteration startDate.
            var currentIterationMoment = moment(startDate);
            request.post(pesqRegUrl, {
                form: dateSubmissionForm
            }, processReturnData(currentIterationMoment));

            startDate.add(1, 'days');
        }
    });

    return deferredScrapeEntries.promise;
};



//Persistance functions
var deleteCurrentEntries = function(models, userId, startDate, endDate) {
    return models.TimeEntry.deleteUserEntriesOnPeriod(userId, startDate, endDate);
};


var persistNewEntries = function(models, timeEntries) {

    var dbDefered = Q.defer();
    //TODO: use transaction plugin.
    // models.db.transaction(function (err, transaction) {
    // });


    models.TimeEntry.create(timeEntries, function(err, data) {
        if (err) {
            var msg = 'Error when creating timeEntry: ' + err;
            scrapingResultObj.messages.push(msg);
            dbDefered.resolve(scrapingResultObj);
            return;
        }
        dbDefered.resolve(data);
    });

    return dbDefered.promise;
};



var scrapeTimeEntriesClean = function(models, serviceRequestObject, parameters) {
    //Run stuff. When finished, save new satus for serviceRequestObject
    var deferred = Q.defer();
    console.log('Will run scrapeTimeEntriesClean for period: ' + parameters.startDate + ' to ' + parameters.endDate);
    //The service for timeentry processing should, at the least, have a username and password that we will need to authenticate before scraping.
    if (!parameters || !parameters.userId || !parameters.username || !parameters.password) {
        console.log('scrapeTimeEntriesClean failed due to lack of required parameters');
        serviceRequestObject.status = 'failed';
        serviceRequestObject.save(function(err, o) {
            if (err) {
                deferred.reject(err);
                return;
            }
            deferred.resolve(o);
            console.log('persisted serviceRequestObject: ' + JSON.stringify(o));
        });

        return deferred.promise;
    }

    return scrapeTimeEntries(models, parameters.userId, parameters.username, parameters.password, parameters.startDate, parameters.endDate)
        .then(function(resolveObject) {
            //Scraped all timeEntries. Now we can persist them
            //Delete, then save, then finish by updating servicerequest.
            return deleteCurrentEntries(models, parameters.userId, parameters.startDate, parameters.endDate)
                .then(function() {
                    return persistNewEntries(models, scrapingResultObj.timeEntries);
                })
                .then(function() {
                    serviceRequestObject.status = 'finished';
                    serviceRequestObject.observation = resolveObject.messages.join('\n');

                    serviceRequestObject.save(function(err, o) {
                        console.log('persisted serviceRequestObject: ' + JSON.stringify(o));
                    });
                });

        });

};

module.exports = {
    // scrapeTimeEntries: scrapeTimeEntries,
    scrapeTimeEntriesClean: scrapeTimeEntriesClean
};
