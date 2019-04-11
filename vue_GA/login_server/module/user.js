var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

module.exports = function(sequlize, DataTypes) {
  var User =  sequlize.define(
    'user',
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'username'
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'password'
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'code'
      }
    },
    {
      hooks: {
        beforeCreate: user => {
          user.password = user.encryptPassword(user.password);
        },
      },
      freezeTableName: true,
      tableName: 'user',
      timestamps: false
    }
  );

  User.prototype.encryptPassword = function (password) { 
    return bcrypt.hashSync(password, 10);
  }

  User.prototype.toAuthJSON = function () {
    return {
      username: this.username,
      code: this.code,
      token: this.generateJWT()
    };
  }

  User.prototype.generateJWT = function () {  
    return jwt.sign({
      username: this.username,
      code: this.code
    }, 'secretkey');
  }

  return User;
}