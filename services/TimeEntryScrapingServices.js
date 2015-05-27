'use strict';
var request = require('request').defaults({
    jar: true
});
var cheerio = require('cheerio');
var moment = require('moment');
var Q = require('q');
var PhaseController = require('../infra/PhaseController');


var scrapeTimeEntries = function(appconfig, models, userId, username, password, startDate, endDate) {
    var phaseController;
    var deferredScrapeEntries;
    var scrapingResultObj = {
        messages: [],
        timeEntries: []
    };
    var $;


    var scrapingAllDone = function() {
        deferredScrapeEntries.resolve(scrapingResultObj);
    };

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

        phaseController.endPhase('processdayX', scrapingAllDone);
    };




    deferredScrapeEntries = Q.defer();
    startDate = moment(startDate);
    endDate = moment(endDate);

    //Try to post login and recieve cookie...
    // var loginUrl = 'https://prod2.camara.gov.br/SigespNet/Autenticacao/validarLogonEfetuarLogon.do';
    // var entrySearchUrl = 'https://prod2.camara.gov.br/SigespNet/SigespNetUsuario/dadosRegistroEletronicoEfetuarConsulta.do';
    var loginUrl = appconfig.camaranettimeentries.loginUrl;
    var entrySearchUrl = appconfig.camaranettimeentries.entrySearchUrl;

    //Find how many days we want to scrape.
    var days = endDate.diff(startDate, 'days');

    var processReturnData = function(dayArg) {
        var day = moment(dayArg);
        scrapingResultObj.messages.push('Called processReturnData function with dayArg: ' + dayArg.format('DD/MM/YYYY'));

        return function(err, httpResponse, body) {
            scrapingResultObj.messages.push('Inside of function created by processReturnData. Day closuer: ' + day.format('DD/MM/YYYY'));

            $ = cheerio.load(body);
            $('#dtListagem').filter(function() {
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
            request.post(entrySearchUrl, {
                form: dateSubmissionForm
            }, processReturnData(currentIterationMoment));

            startDate.add(1, 'days');
        }
    });

    return deferredScrapeEntries.promise;
};



//Persistance functions
var deleteCurrentEntries = function(models, userId, startDate, endDate) {
    var excludedOrigins = ['manual'];
    return models.TimeEntry.deleteUserEntriesOnPeriod(userId, startDate, endDate, excludedOrigins);
};


var persistNewEntries = function(models, scrapingResultObj) {
    var dbDefered = Q.defer();
    models.TimeEntry.create(scrapingResultObj.timeEntries, function(err, data) {
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
    // scrapingResultObj = {
    //     messages: [],
    //     timeEntries: []
    // };
    //Run stuff. When finished, save new satus for serviceRequestObject
    var deferred = Q.defer();
    console.log('Will run scrapeTimeEntriesClean for period: ' + parameters.startDate + ' to ' + parameters.endDate);
    //If we did not recieve userId, than get it from request.
    var userId;
    if (parameters && !parameters.userId && parameters.req && parameters.req.user) {
        userId = parameters.req.user.id;
    }

    // //If we did not get a userId from request, check in parameters... (we should check)
    // if (!userId && parameters) {
    //     userId = parameters.userId;
    // }


    //The service for timeentry processing should, at the least, have a username and password that we will need to authenticate before scraping.
    if (!parameters || !userId || !parameters.username || !parameters.password) {
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

    return scrapeTimeEntries(parameters.appconfig, models, userId, parameters.username, parameters.password, parameters.startDate, parameters.endDate)
        .then(function(resolveObject) {
            //Scraped all timeEntries. Now we can persist them
            //Delete, then save, then finish by updating servicerequest.

            return deleteCurrentEntries(models, userId, parameters.startDate, parameters.endDate)
                .then(function() {
                    // return persistNewEntries(models, scrapingResultObj.timeEntries);
                    return persistNewEntries(models, resolveObject);
                })
                .then(function() {
                    var deferred = Q.defer();
                    serviceRequestObject.status = 'finished';
                    serviceRequestObject.observation = resolveObject.messages.join('\n');
                    serviceRequestObject.save(function(err, o) {
                        deferred.resolve(o);
                        return o;
                    });
                    //need to return promise from here.
                    return deferred.promise;

                });

        });
};

module.exports = {
    // scrapeTimeEntries: scrapeTimeEntries,
    scrapeTimeEntriesClean: scrapeTimeEntriesClean
};
