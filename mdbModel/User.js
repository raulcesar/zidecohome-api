var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	identifier: {type: String, required: true},
	disabled: Boolean,
	passhash: String,
	experationDate: Date,
	aliases: [String],
	roles: [{
		code: String,
		startDate: Date,
		endDate: Date
	}]
});


var schemaName = 'user';
// var schemaValue: mongoose.model('user', userSchema)
module.exports = {
	schemaName: schemaName,
	schemaValue: mongoose.model('user', userSchema)
}
