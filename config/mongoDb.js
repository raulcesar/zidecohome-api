'use strict';
//Configuration stuff for mongo
var linebyline = require('linebyline'),
	mongoose = require('mongoose');


if (process.platform === 'win32') {
	var rl = linebyline.createInterface( {
		input: process.stdin,
		output: process.stdout
	});
	rl.on('SIGINT', function() {
		process.emit('SIGINT');
	});
}

var dbURI = 'mongodb://cronos64/zideco'; //TODO: GET FROM CONFIG
dbURI = 'mongodb://localhost/zideco'; //TODO: GET FROM CONFIG

var gracefullShutdown = function(msg, callback) {
	mongoose.connection.close(function() {
		console.log('Closing connection to mongoose @ ' + dbURI + ' by ' + msg);
		callback();
	});
};


mongoose.connect(dbURI);

mongoose.connection.on('connected', function() {
	console.log('Connected to mongoose @ ' + dbURI);
});

mongoose.connection.on('error', function(error) {
	console.log('The pou when connecting to mongoose @ ' + dbURI + '. Error: ' + error);
});

mongoose.connection.on('disconnected', function() {
	console.log('Disconnected to mongoose @ ' + dbURI);
});

process.once('SIGUSR2', function() {
	gracefullShutdown('nodemon restart', function() {
		process.kill(process.pid, 'SIGUSR2');
	});
});

process.once('SIGINT', function() {
	gracefullShutdown('app termination', function() {
		process.exit(0);
	});
});

process.once('SIGTERM', function() {
	gracefullShutdown('HEROKU app termination', function() {
		process.exit(0);
	});
});


module.exports = {};