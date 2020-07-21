const Sequelize = require('sequelize');
const config = require('./env');

// Set up the config
const sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
  host: config.mysql.host,
  port: config.mysql.port,
  dialect: 'mysql',
  logging: 0, // Disable logging
  operatorsAliases: 0, // Disable aliases
});

sequelize.authenticate();

module.exports = { sequelize, Sequelize };
