/**
 * Created by raul on 4/28/14.
 */

var logAndRespond = function (err, res, status) {
    console.error(err);
    res.statusCode = ('undefined' === typeof status ? 500 : status);
    res.send({
        result: 'error',
        err: err.code
    });
};

var resolveConection = function (callback, req, res) {
    req.mysql.getConnection(function (err, connection) {
        if (err) {
            logAndRespond(err, res);
            return;
        }
        console.log('connected as id ' + connection.threadId);
        callback(connection, req, res);
    });
};

module.exports = {
    version: '0.0.1',
    resolveConection: resolveConection,
    logAndRespond: logAndRespond
}
