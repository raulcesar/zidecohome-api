'use strict';
var conf = require('../infra/conf').get(); //Objeto de configuração... varias entradas, baseada no process.env.NODE_ENV (PROD, DEV, etc.)
var models = require('../models')(conf);


models.sequelize.sync({force: true});
