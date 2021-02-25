const fs = require('fs')

const {Fund, User, UserFund} = require('../models')
const {parseCurrency, parseDate, getFundRaised} = require('../helpers')

class Controller {
  static findAll(req, res) {
    Fund
      .findAll({
        include: {
          model: UserFund,
          where: {
            status: 'Verified'
          },
          required: false
        }
      })
      .then(data => {
        res.render('admin/fund', {
          title: 'List',
          data,
          parseCurrency,
          getFundRaised
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
    const user = req.session.user
    Fund
      .findAll({
        include: {
          model: UserFund,
          where: {
            status: 'Verified'
          },
          required: false
        },
        order: ['due_date']
      })
      .then(data => {
        res.render('home', {
          data,
          parseCurrency,
          getFundRaised,
          user
        })
      })
      .catch(err => {
        res.send(err.message)
      })
  }

  static users(req, res) {
    const id = req.params.id
    let passedData = {name: '', users: []}
    Fund
      .findByPk(id)
      .then(data => {
        passedData.name = data.name
        return data.getUsers()
      })
      .then(data => {
        data.forEach(el => {
          const {transaction_id, amount, status} = el.UserFund
          passedData.users.push({
            name: el.name,
            transaction_id,
            amount,
            status
          })
        })
        // res.send(passedData)
        res.render('admin/fund-user', {
          data: passedData,
          parseCurrency
        })
      })
      .catch(err => 
        res.send(err))
  }
}

module.exports = Controller