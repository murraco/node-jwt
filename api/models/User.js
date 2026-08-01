const bcrypt = require('bcrypt');
const { v1: uuidv1 } = require('uuid');

const { sequelize, Sequelize } = require('../../config/sequelize');

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: {
      args: true,
      msg: 'Username already exists',
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  refresh_token: {
    type: Sequelize.UUID,
    allowNull: false,
    unique: {
      args: true,
      msg: 'Odds are really against you',
    },
    // Sequelize.UUIDV1 is a generator, evaluated per row. Calling uuidv1() here would
    // instead freeze a single value at module load, handing every row the same default
    // and making the unique constraint fire on the second insert.
    defaultValue: Sequelize.UUIDV1,
  },
}, { underscored: true });

User.beforeCreate((user) => {
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  user.refresh_token = uuidv1();
});

User.prototype.comparePassword = function (somePassword) {
  return bcrypt.compareSync(somePassword, this.password);
};

// Everything the API is allowed to send back about a user. Anything not listed here --
// notably password and refresh_token -- must never reach a response body.
User.prototype.toPublicJSON = function () {
  return {
    id: this.id,
    username: this.username,
    created_at: this.created_at,
    updated_at: this.updated_at,
  };
};

module.exports = User;
