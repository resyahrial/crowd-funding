const {User} = require('../models')
const {parseCurrency} = require('../helpers')

class Controller {
  static findAll(req, res) {
    User
      .findAll({
        order: [['updatedAt', 'DESC']],
        attributes: ['id', 'name', 'balance']
      })
      .then(data => {
        data = data.filter(el => el.name !== 'admin')
        res.render('admin/user', {
          data,
          parseCurrency
        })
      })
      .catch(err => {
        res.send(err)
      })
  }
}

module.exports = Controller