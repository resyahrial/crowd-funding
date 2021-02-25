'use strict';
const {
  Model
} = require('sequelize');
const {hashPassword} = require('../helpers')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Fund, { through: models.UserFund})
      User.hasMany(models.UserFund, { foreignKey: 'UserId' })
    }
  };
  User.init({
    username: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: `Username can't be empty`
        },
        isUnique: (username, next) => {
          User
            .findOne({
              where: {
                username
              }
            })
            .then(user => {
              if (user) {
                return next('Username already in use')
              }
              return next()
            })
            .catch(err => {
              return next(err.message)
            })
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: `Password can't be empty`
        }
      }
    },
    is_admin: DataTypes.BOOLEAN,
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: `Name can't be empty`
        }
      }
    },
    balance: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user) => {
        user.password = hashPassword(user.password)
        user.is_admin = user.username.toLowerCase() === 'admin'
        user.balance = 0
      },
      afterCreate: (user) => {
        const {id, name, username} = user
        return {
          id,
          name,
          is_admin: username === 'admin'
        }
      }
    }
  });
  return User;
};