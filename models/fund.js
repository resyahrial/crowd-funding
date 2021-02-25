'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Fund extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Fund.belongsToMany(models.User, { through: models.UserFund})
      Fund.hasMany(models.UserFund, { foreignKey: 'FundId' })
    }

    getRemainDate() {
      const remainDay = this.due_date - new Date()
      return new Date(remainDay).getDate()
    }
  };
  Fund.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: `Name can't be empty`
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: `Type can't be empty`
        }
      }
    },
    business_value: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: `Business value can't be empty`
        }
      }
    },
    due_date: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          args: true,
          msg: 'Due date must be on date format'
        }
      }
    },
    image_url: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Fund',
    hooks: {
      beforeCreate: (fund) => {
        const currDate = new Date()
        const nextWeek = currDate.setDate(currDate.getDate() + 6)
        fund.due_date = new Date(fund.due_date) < currDate || new Date(fund.due_date) < new Date(nextWeek)
          ? nextWeek : fund.due_date
      },
      beforeUpdate: (fund) => {
        if (fund.due_date < new Date()) {
          throw new Error(`Due date can't be day before today`)
        }
      }
    }
  });
  return Fund;
};