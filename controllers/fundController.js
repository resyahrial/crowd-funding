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
          title: 'List',
          data,
          getDayRemain,
          parseCurrency
        })
      })
      .catch(err => {
        res.send(err.message)
      })
  }

  static add (req, res) {
    if (req.method === 'GET') {
      res.render('admin/fund', {
        title: 'Add'
      })
      return
    }

    const {name, type, business_value, due_date, description} = req.body
    const fund = {name, type, business_value, due_date, description, image_url: `images/${req.file.filename}`}
    Fund
      .create(fund)
      .then(() => {
        res.redirect('/funds')
      })
      .catch(err => {
        res.send(err.message)
      })
  }
}

module.exports = Controller