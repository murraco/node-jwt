const Sequelize = require('sequelize');

const config = require('./env');

// Set up the config
const sequelize = new Sequelize(
  config.mysql.database,
  config.mysql.username,
  config.mysql.password,
  {
    host: config.mysql.host,
    port: config.mysql.port,
    dialect: 'mysql',
    logging: false, // Disable logging
  },
);

// An unhandled rejection here takes the process down on Node 20+, so surface the real
// connection error instead.
sequelize.authenticate().catch((e) => {
  const reason = (e.original && e.original.message) || e.message || e.name;
  console.error(`Unable to connect to the database: ${reason}`);
});

module.exports = { sequelize, Sequelize };
