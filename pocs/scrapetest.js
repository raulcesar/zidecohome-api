'use strict';
var request = require('request').defaults({
    jar: true
});
var cheerio = require('cheerio');
var moment = require('moment');
var _ = require('lodash');
var argv = require('optimist').argv;


if (!argv.password) {
    throw new Error('Bonk... no password!');
}

if (!argv.username) {
    throw new Error('Bonk... no password!');
}






//var url = 'https://prod2.camara.gov.br/SigespNet/SigespNetUsuario/dadosRegistroEletronicoPrepararVisualizacao.do';
//Try to post login and recieve cookie...
var loginUrl = 'https://prod2.camara.gov.br/SigespNet/Autenticacao/validarLogonEfetuarLogon.do';

var dateString, timeString;
var dates = [];

var $;
var processdata = function(day, data) {
    data.each(function(i, elem) {
        //Every odd item should be a date.

        var test = $(elem).text();

        if (test.indexOf('/') >= 0) {
            dateString = test.trim();
            if ((i % 2) !== 0) {
                console.log('Probable error! i should be even, but is: ' + i);
            }
        } else if (test.indexOf(':') >= 0) {
            timeString = test.trim();
            dates.push(moment(dateString + ' ' + timeString, 'DD/MM/YYYY hh:mm'));

            if ((i % 2) === 0) {
                console.log('Probable error! i should be odd, but is: ' + i);
            }
        } else {
            console.log('Probable error! Should have only dates and times.' + test);
        }
    });

    _.each(dates, function(entry) {
        console.log(entry.format('DD/MM/YYYY hh:mm'));

    });


};

var dateStart = moment('04/05/2015', 'DD/MM/YYYY');
var pesqRegUrl = 'https://prod2.camara.gov.br/SigespNet/SigespNetUsuario/dadosRegistroEletronicoEfetuarConsulta.do';
pesqRegUrl = 'https://prod2.camara.gov.br/SigespNet/SigespNetUsuario/dadosRegistroEletronicoEfetuarConsulta.do';


var processReturnData = function(err, httpResponse, body) {
    $ = cheerio.load(body);
    // id="dtListagem"
    $('#dtListagem').filter(function(obj) {
        var data = $(this).children('tbody').children('tr').children('td');
        processdata('', data);
    });
};


// First, login
request.post(loginUrl, {
    form: {
        txtLogin: argv.username,
        txtSenha: argv.password
    }
}, function(err, httpResponse, body) {
    //got cookie.
    for (var dayI = 0; dayI < 3; dayI++) {
        var dateSubmissionForm = {
            dataRegistroEletronico: dateStart.format('DD/MM/YYYY')
        };
        console.log('Going to get entries for: ' + dateSubmissionForm.dataRegistroEletronico);

        request.post(pesqRegUrl, {
            form: dateSubmissionForm
        }, processReturnData);

		dateStart.add(1, 'days');

    }


    // request(url, function(error, response, html) {
    //     //Search days we need....
    //     var dateSubmissionForm = {
    //         dataRegistroEletronico: dateStart.format('DD/MM/YYYY')
    //     };

    //     request.post(pesqRegUrl, {
    //         form: dateSubmissionForm
    //     }, function(err, httpResponse, body) {
    //         $ = cheerio.load(body);
    //         // id="dtListagem"
    //         $('#dtListagem').filter(function(obj) {
    //             var data = $(this).children('tbody').children('tr').children('td');
    //             processdata('', data);

    //         });


    //     });


    // });


});



// var html = '<table id="dtListagem" class="displaytag"> ' +
//     '    <thead> ' +
//     '        <tr> ' +
//     '            <th>Data</th> ' +
//     '            <th>Horrio Registro</th> ' +
//     '        </tr> ' +
//     '    </thead> ' +
//     '    <tbody> ' +
//     '        <tr class="odd"> ' +
//     '            <td style="text-align: left; width: 30%;">20/05/2015</td> ' +
//     '            <td style="text-align: left; width: 70%;">07:58</td> ' +
//     '        </tr> ' +
//     '        <tr class="even"> ' +
//     '            <td style="text-align: left; width: 30%;">20/05/2015</td> ' +
//     '            <td style="text-align: left; width: 70%;">11:48</td> ' +
//     '        </tr> ' +
//     '        <tr class="odd"> ' +
//     '            <td style="text-align: left; width: 30%;">20/05/2015</td> ' +
//     '            <td style="text-align: left; width: 70%;">14:44</td> ' +
//     '        </tr> ' +
//     '        <tr class="even"> ' +
//     '            <td style="text-align: left; width: 30%;">20/05/2015</td> ' +
//     '            <td style="text-align: left; width: 70%;">19:03</td> ' +
//     '        </tr> ' +
//     '    </tbody> ' +
//     '</table> ';


// var $ = cheerio.load(html);
// var data = $('#dtListagem').children('tbody').children('tr').children('td');
// data.each(function(i, elem) {
//     //Every odd item should be a date.
//     var test = $(elem).text();

//     if (test.indexOf('/') >= 0) {
//         dateString = test.trim();
//         if ((i % 2) !== 0) {
//             console.log('Probable error! i should be even, but is: ' + i);
//         }
//     } else if (test.indexOf(':') >= 0) {
//         timeString = test.trim();
//         dates.push(moment(dateString + ' ' + timeString, 'DD/MM/YYYY hh:mm'));

//         if ((i % 2) === 0) {
//             console.log('Probable error! i should be odd, but is: ' + i);
//         }
//     } else {
//         console.log('Probable error! Should have only dates and times.' + test);
//     }

// });

// //Generate file...
// _.each(dates, function(entry) {
//     console.log(entry.format('DD/MM/YYYY hh:mm'));

// });

// // var process = function() {
// //     var data = $(this).children('tbody').children('tr');
// //     console.log(data.first().text());

// // };
// // $('#dtListagem').filter(process);
// // // $('#dtListagem').filter(function() {
// // //     var data = $(this).children('tbody').children('tr');
// // //     console.log(data.first().text());

// // // });
