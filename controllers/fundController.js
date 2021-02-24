const fs = require('fs')

const {Fund, User, UserFund} = require('../models')
const {parseCurrency, parseDate} = require('../helpers')

class Controller {
  static findAll(req, res) {
    Fund
      .findAll({
        include: {
          model: UserFund
        }
      })
      .then(data => {
        res.render('admin/fund', {
          title: 'List',
          data,
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
        data: null,
        parseDate,
      })
      return
    }

    const {name, type, business_value, due_date, description} = req.body
    const fund = {name, type, business_value, due_date, description, image_url: `images/${req.file.filename}`}
    Fund
      .create(fund)
      .then(() => {
        res.redirect('/admin/funds')
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
        res.redirect('/admin/funds')
      })
      .catch(err => {
        res.send(err.message)
      })
  }

  static delete(req, res) {
    const id = req.params.id
    Fund
      .destroy({
        where: {
          id
        }
      })
      .then(() => {
        return Fund.findByPk(id, {
          attributes: ['image_url']
        })
      })
      .then(data => {
        fs.unlinkSync(`public/${data.image_url}`)
        res.redirect('/admin/funds')
      })
      .catch(err => {
        res.send(err)
      })
  }

  static home(req, res) {
    Fund
      .findAll({
        include: {
          model: User
        },
        order: ['due_date']
      })
      .then(data => {
        res.render('home', {
          data,
          parseCurrency
        })
      })
      .catch(err => {
        res.send(err.message)
      })
  }

  static users(req, res) {
    const id = req.params.id
    Fund
      .findByPk(id, {
        attributes: ['id', 'name'],
        include: {
          model: UserFund,
          attributes: ['id', 'amount', 'status'],
          include: {
            model: User,
            attributes: ['id', 'name']
          }
        }
      })
      .then(data => {
        res.render('admin/fund-user', {
          data,
          parseCurrency
        })
      })
      .catch(err => 
        res.send(err))
  }
}

module.exports = Controller