'use strict';
// Nodejs encryption with CTR
var crypto = require('crypto'),
    argv = require('optimist').argv
    // ,
    // _ = require('lodash')
;



// function encrypt(text) {
//     var cipher = crypto.createCipher(algorithm, password);
//     var crypted = cipher.update(text, 'utf8', 'hex');
//     crypted += cipher.final('hex');
//     return crypted;
// }

// function decrypt(text) {
//     var decipher = crypto.createDecipher(algorithm, password);
//     var dec = decipher.update(text, 'hex', 'utf8');
//     dec += decipher.final('utf8');
//     return dec;
// }


//If -e flag, than encrypt.
var algorithm = 'aes256';
var msg = [];
if (argv.e) {
    if (!argv.password) {
        throw new Error('Bonk... no password!');
    }

    
    var cipher = crypto.createCipher(algorithm, argv.password);
    argv._.forEach(function(phrase) {
        msg.push(cipher.update(phrase, 'binary', 'hex'));
    });

    msg.push(cipher.final('hex'));
    console.log(msg.join(''));
} else if (argv.d) {
    if (!argv.password) {
        throw new Error('Bonk... no password!');
    }

    var decipher = crypto.createDecipher(algorithm, argv.password);
    argv._.forEach(function(phrase) {
        msg.push(decipher.update(phrase, 'hex', 'binary'));
    });
    msg.push(decipher.final('binary'));
    console.log(msg.join(''));
}


// var hw = encrypt('hello world');
// console.log(hw);
// // console.log(decrypt(hw));


// var hw = encrypt('h');
// console.log(hw);
