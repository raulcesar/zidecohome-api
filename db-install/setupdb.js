/**
 * Created by raul on 10/21/14.
 */
'use strict';
var env =  process.env.NODE_ENV || 'development';

var conf = require('../config/conf').get( env);
var models = require('../models')(conf);

models.sequelize.sync({force: true}).on('sql', function (sql) {
  console.log(sql);
});
