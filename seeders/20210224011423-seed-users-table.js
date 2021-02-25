'use strict';
const fs = require('fs')
const {hashPassword} = require('../helpers')
module.exports = {
  up: (queryInterface, Sequelize) => {
    let data = fs.readFileSync('./data/user.json', 'utf-8')
    data = JSON.parse(data)
    data.forEach(elem => {
      elem.password = hashPassword(elem.password)
      elem.createdAt = new Date()
      elem.updatedAt = new Date()
    });
    return queryInterface.bulkInsert('Users', data, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
};
