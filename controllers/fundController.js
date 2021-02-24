const {Fund, User} = require('../models')
const {getDayRemain, parseCurrency} = require('../helpers')

class Controller {
  static findAll(req, res) {
    Fund
      .findAll({
        include: {
          model: User
        }
      })
      .then(data => {
        res.render('admin/fund', {
          data,
          getDayRemain,
          parseCurrency
        })
      })
      .catch(err => {
        res.send(err.message)
      })
  }
}

module.exports = Controller