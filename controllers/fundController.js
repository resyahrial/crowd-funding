const fs = require('fs')

const {Fund, User} = require('../models')
const {getDayRemain, parseCurrency, parseDate} = require('../helpers')

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

  static add(req, res) {
    if (req.method === 'GET') {
      res.render('admin/fund', {
        title: 'Add',
        data: null
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

  static edit(req, res) {
    const id = req.params.id
    if (req.method === 'GET') {
      Fund
        .findByPk(id, {
          include: {
            model: User
          }
        })
        .then(data => {
          res.render('admin/fund', {
            title: 'Edit',
            data,
            parseDate
          })
        })
        .catch(err => {
          res.send(err.message)
        })
      return
    }

    const {name, type, business_value, due_date, description, last_image_url} = req.body
    const fund = {name, type, business_value, due_date, description}
    if (req.file) {
      fs.unlinkSync(`public/${last_image_url}`)
      fund.image_url = `images/${req.file.filename}`
    }
    Fund
      .update(fund, {
        where: {
          id
        }
      })
      .then(() => {
        res.redirect('/funds')
      })
      .catch(err => {
        res.send(err.message)
      })
  }
}

module.exports = Controller