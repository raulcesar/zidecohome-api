/**
 * Created by raul on 10/21/14.
 */

var env =  process.env.NODE_ENV || 'development';

var conf = require('../infra/conf').get( process.env.NODE_ENV);
var models = require("..//models")(conf);

models.sequelize.sync().on('sql', function (sql) {
  console.log(sql);
});
