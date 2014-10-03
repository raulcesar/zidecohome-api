/**
 * Created by raul on 10/3/14.
 */
var http = require('http');
//var https = require('https');

var path = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=ya29.kgCQnNopP_uGEfpjTcCoGxC12UA9T4gs_JDun6G6gjyKd9arvzGRU78M';

var options = {
    host: 'localhost',
    port: 3128,
    path: path,
    headers: {
        'Proxy-Connections': 'keep-alive',
        'Host': 'www.googleapis.com'
    },
    method: 'GET'
};


var body = '';

var req = http.request(options, function (res) {
    console.log('REQUEST STATUS: ' + res.statusCode);
    console.log('REQUEST HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
        process.stdout.write(body);
        body += chunk;
    });
    res.on('end', function () {
        process.stdout.write(body);
    });
});

req.on('error', function (e) {
    process.stdout.write(e);

});

req.end();


//http.get(options, function(res) {
//    console.log(res);
//    res.pipe(process.stdout);
//});