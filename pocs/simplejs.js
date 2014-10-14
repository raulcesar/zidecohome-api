var a = '5HfPBmR2Am68 DM8bMnwlw==referer=/protegida';
var b = '5HfPBmR2Am68+DM8bMnwlw==referer=/protegida';
var b1 = b.replace(/\//g, '-').replace(/\+/g, '_');

var c = (a !== b);

console.log('c: ' + c);
console.log('a: ' + a);
console.log('b: ' + b);
console.log('b1: ' + b1);



//var xss = require('node-xss').clean;
//var sanitezed = xss(b);
//console.log('sanitezed: ' + sanitezed);


//gen-delims  = ":" / "/" / "?" / "#" / "[" / "]" / "@"
//sub-delims  = "!" / "$" / "&" / "'" / "(" / ")"
//  / "*" / "+" / "," / ";" / "="


var validator = require('validator');
var test = 'raul :/?#[]@!$&\'()*+,;=cesar';
var retorno = validator.blacklist(test, ':/\\?#\\[\\]@!\\$&\'\\(\\)\\*\\+,;=');
console.log('retorno: ' + retorno);


//validator.blacklist(b, ':/?#[]@!$&\'()*+,;=')