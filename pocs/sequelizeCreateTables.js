'use strict';
var conf = require('../config/conf').get(); //Objeto de configuração... varias entradas, baseada no process.env.NODE_ENV (PROD, DEV, etc.)
var models = require('../models')(conf);


models.sequelize.sync({force: true}).then(function()  {
	//Create first user row:
	models.UserRole.create({
		code: 'SU',
		description: 'Super User Role'
	}).then(function(suRole) {
		//Create user SU:
		models.ZidecoUser.create({
         identifier: 'su',
         disabled: false
		}).then(function(su) {
			var data = new Date();
			// su.addRole(suRole);
			su.setRoles([suRole]);
		});

	});
});

