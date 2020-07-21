const bcrypt = require('bcrypt');
const uuidv1 = require('uuid/v1');

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
    defaultValue: uuidv1(),
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

module.exports = User;
