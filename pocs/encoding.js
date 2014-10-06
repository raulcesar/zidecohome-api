/**
 * Created by raul on 10/6/14.
 */

//console.log(new Buffer("sectoken%3D0BaAaYKw9r6TsXdTIgSICgurl/protegida").toString('base64'));

var testreturn = 'oETcmhekYHrvnFreNrPmBw==referer=/protegida';
console.log(new Buffer(testreturn, 'base64').toString('ascii'));