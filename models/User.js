const { DataTypes } = require('sequelize');
const sequelize = require('../config/pgClient');

const User = sequelize.define('users', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
  },
  email: DataTypes.STRING,
  user_name: DataTypes.STRING,
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  password: DataTypes.STRING,
  department: DataTypes.STRING,
  tech_stack: DataTypes.STRING,
  profile_photo_url: DataTypes.STRING,
  active: DataTypes.BOOLEAN,
  wallet_balance: DataTypes.INTEGER,
  last_login: DataTypes.DATE,
});

module.exports = User;
