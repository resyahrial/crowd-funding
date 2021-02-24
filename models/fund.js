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
  };
  Fund.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    business_value: DataTypes.INTEGER,
    due_date: DataTypes.DATE,
    image_url: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Fund',
  });
  return Fund;
};