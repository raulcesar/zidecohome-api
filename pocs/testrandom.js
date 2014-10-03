/**
 * Created by raul on 10/3/14.
 */
var crypto = require('crypto');


var buf = crypto.pseudoRandomBytes(256);
var md5 = crypto.createHash('md5');

md5.update(buf);
var id = md5.digest('base64');

console.log(id);