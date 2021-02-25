const uploadImage = require('./uploadImage')
const {isAdmin, isLogin} = require('./auth')

module.exports = {
  uploadImage,
  isAdmin,
  isLogin
}