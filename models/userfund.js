'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserFund extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserFund.belongsTo(models.User, { foreignKey: 'UserId' })
      UserFund.belongsTo(models.Fund, { foreignKey: 'FundId' })
    }
  };
  UserFund.init({
    UserId: DataTypes.INTEGER,
    FundId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserFund',
  });
  return UserFund;
};