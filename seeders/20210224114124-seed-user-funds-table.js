'use strict';
const fs = require('fs')
module.exports = {
  up: (queryInterface, Sequelize) => {
    let data = fs.readFileSync('./data/userfund.json', 'utf-8')
    data = JSON.parse(data)
    data.forEach(elem => {
      elem.createdAt = new Date()
      elem.updatedAt = new Date()

      // generate transaction id
      const randomCode = (""+Math.random()).substring(2,5)
      let month = elem.createdAt.getMonth() + 1
      month = month <= 9 ? `0${month}` : `${month}`
      const year = `${elem.createdAt.getFullYear()}`.slice(2)
      elem.transaction_id = `TRX-${month}${year}-${randomCode}`
    });
    return queryInterface.bulkInsert('UserFunds', data, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserFunds', null, {})
  }
};
