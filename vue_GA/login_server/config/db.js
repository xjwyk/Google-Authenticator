var Sequelize = require("sequelize");
var sequelize = new Sequelize('vue_login', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql',
  operratorsAliases: false,
  dialectOptions: {
    // 字符集
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    supportBigNumbers: true,
    bigNumberStrings: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 3000,
    idle: 10000
  },
  timezone: '+08:00'      // 设定时区为东八区
});

module.exports = {
  sequelize
};