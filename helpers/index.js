const parseCurrency = require('./parseCurrency')
const parseDate = require('./parseDate')
const {hashPassword, checkPassword} = require('./passwordHandle')
const getFundRaised = require('./getFundRaised')

module.exports = {
  parseCurrency,
  parseDate,
  hashPassword,
  checkPassword,
  getFundRaised
}