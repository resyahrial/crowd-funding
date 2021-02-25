const uploadImage = require('./uploadImage')
const {isAdmin} = require('./auth')

module.exports = {
  uploadImage,
  isAdmin
}