/**
 * Created by raul on 10/3/14.
 */
var request = require('request')
    , url = require('url');


var token = 'ya29.kwAv-9Gs077fAvwCK7eGmc6ZKs8m1rGHEaqVz0tE8ufeacUND9MJKA3t';

//token = 'ya29.kwAv-9Gs077fAvwCK7eGmc6ZKs8m1rGHEaqVz0tE8ufeacUND9MJKA3';
//var path = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + token;

var googleTokenInfoUrl = 'https://www.googleapis.com/oauth2/v1/tokeninfo'
var ze = url.format(
    {
        pathname: googleTokenInfoUrl,
        query: {access_token: token}
    });



var options = {
    'url': url.format(
        {
            'pathname': googleTokenInfoUrl,
            'query': {'access_token': token}
        }),
    method: 'GET',
    json: true
};

//Create options to post to google token endpoint and retrieve access token.
var globalOptions = {
    googleTokenEndpoint: 'https://accounts.google.com/o/oauth2/token',
    googleTokenInfoEndpoint: 'https://www.googleapis.com/oauth2/v1/tokeninfo',
    appClientID:'965550095210-5l68e76451uj3cjau9oahkmov3l9lk2l.apps.googleusercontent.com',
    appClientSecret: '_rqDu5zzkKvmqja_la8UPhBd',
    appRedirectURI:'http://localhost:3030/auth/google/return/'
};

var optionsForIDToken = {
    url: globalOptions.googleTokenEndpoint,
    method: 'POST',
    json: true,
    form: {
        code: '4/RI2WfXx-sKW1E-e-iBROt-7ZrhCt.Mr2MtH0-y3kd3oEBd8DOtNCxTpCvkQI',
        client_id: globalOptions.appClientID,
        client_secret: globalOptions.appClientSecret,
        redirect_uri: globalOptions.appRedirectURI,
        grant_type: 'authorization_code'
    }
};

var optionsForAcessToken = {
    url: url.format(
        {
            pathname: globalOptions.googleTokenInfoEndpoint,
            query: {id_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjlmOWJmYjBmZjlmNjU1MTEzYWRlNGNhMTM0Y2M0MjZhODI0ZmMyNWIifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwic3ViIjoiMTE0MTU0OTc1MTk0NDEzNDc1MTQzIiwiYXpwIjoiOTY1NTUwMDk1MjEwLTVsNjhlNzY0NTF1ajNjamF1OW9haGttb3YzbDlsazJsLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiZW1haWwiOiJyYXVsLnRlaXhlaXJhQGdtYWlsLmNvbSIsImF0X2hhc2giOiJCXzVoNTZiTm5jWHhZZko2VHFHSnVnIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF1ZCI6Ijk2NTU1MDA5NTIxMC01bDY4ZTc2NDUxdWozY2phdTlvYWhrbW92M2w5bGsybC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImlhdCI6MTQxMjM2OTExMywiZXhwIjoxNDEyMzczMDEzfQ.It9doN-pb2G3XG_ospGvbx4u_xdFArTK79ynLpVEzw3vl3n7UYNRWY04h-F6Jo6f6nYx0ldtReO5Uz6QMBb1hCYHZyuMk-oyFmK2QSrXXSxzr1UUXi-iwzBJ7Hyeu2F49hOwQWKM6jiBRmhfasD0EV1P2JdF2Y-gSbmAQtahV8s'}
        }),
    method: 'GET',
    json: true
};


request(optionsForAcessToken,
    function (error, response, body) {
        console.log(body);
    });


