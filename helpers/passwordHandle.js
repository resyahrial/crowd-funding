const bcrypt = require('bcryptjs');

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

const checkPassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword)
}

module.exports = {
  hashPassword,
  checkPassword
}