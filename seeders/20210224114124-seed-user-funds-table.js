'use strict';
const fs = require('fs')
module.exports = {
  up: (queryInterface, Sequelize) => {
    let data = fs.readFileSync('./data/userfund.json', 'utf-8')
    data = JSON.parse(data)
    data.forEach(elem => {
      elem.createdAt = new Date()
      elem.updatedAt = new Date()
    });
    return queryInterface.bulkInsert('UserFunds', data, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserFunds', null, {})
  }
};
