'use strict';
// var a = '5HfPBmR2Am68 DM8bMnwlw==referer=/protegida';
// var b = '5HfPBmR2Am68+DM8bMnwlw==referer=/protegida';
// var b1 = b.replace(/\//g, '-').replace(/\+/g, '_');

// var c = (a !== b);

// console.log('c: ' + c);
// console.log('a: ' + a);
// console.log('b: ' + b);
// console.log('b1: ' + b1);



// //var xss = require('node-xss').clean;
// //var sanitezed = xss(b);
// //console.log('sanitezed: ' + sanitezed);


// //gen-delims  = ":" / "/" / "?" / "#" / "[" / "]" / "@"
// //sub-delims  = "!" / "$" / "&" / "'" / "(" / ")"
// //  / "*" / "+" / "," / ";" / "="


// var validator = require('validator');
// var test = 'raul :/?#[]@!$&\'()*+,;=cesar';
// var retorno = validator.blacklist(test, ':/\\?#\\[\\]@!\\$&\'\\(\\)\\*\\+,;=');
// console.log('retorno: ' + retorno);


// //validator.blacklist(b, ':/?#[]@!$&\'()*+,;=')

var moment = require('moment');
// console.log(moment('2015-02-20').startOf('month').format('DD/MM/YYYY'));
// console.log(moment('2015-12-20').startOf('month').add(1, 'months').format('DD/MM/YYYY'));

// console.log(moment('2015-12-20 15:45:32').hour(5).startOf('hour').format('DD/MM/YYYY hh:mm:ss'));



// console.log(moment('2015-12-20 15:48:32').diff(moment('2015-12-20 15:42:12'), 'minutes'));
// console.log(moment('2015-12-20 15:48:32').date());
// console.log(moment('2015-12-21 08:48:32').date());

// console.log(moment('2015-12-21 08:48:32').startOf('day').format('DD/MM/YYYY hh:mm:ss'));
// console.log(moment('2015-12-21 08:48:32').hour(0).startOf('hour').format('DD/MM/YYYY hh:mm:ss'));

// var dayReference = moment('2015-12-21 08:48:32').startOf('day');
// console.log(moment(dayReference).hour(7).minute(0).format('DD/MM/YYYY hh:mm:ss'));
// console.log(moment(dayReference).hour(7).minute(30).format('DD/MM/YYYY hh:mm:ss'));


// var _ = require('lodash');
// var phases = ['phas1', 'phase2', 'phase3'];

// var obj;
// // obj = _.zipWith([],phases, function(accumulator, value, index, group) {
// //     console.log('accumulator: ' + accumulator);
// //     console.log('value: ' + value);
// //     console.log('index: ' + index);
// //     console.log('group: ' + group);
// //     accumulator ++;
// // });

// obj = _.zipObject(phases, _.fill(_.clone(phases), false));
// console.log('obj: ' + JSON.stringify(obj));

// // obj = _.zipWith([1, 2], [10, 20], [100, 200], function(accumulator, value, index, group) {
// //     console.log('accumulator: ' + accumulator);
// //     console.log('value: ' + value);
// //     console.log('index: ' + index);
// //     console.log('group: ' + group);
// // });
// // console.log('obj: ' + JSON.stringify(obj));

var entryErrado = moment('09/06/2015 09:08', 'DD/MM/YYYY HH:mm');
var hoje = moment();

console.log(entryErrado.day());
console.log(hoje.day());
var issame = entryErrado.isSame(hoje, 'day');
console.log(issame);
