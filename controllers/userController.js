const {User, Fund} = require('../models')
const {parseCurrency, checkPassword, hashPassword} = require('../helpers')

class Controller {
  static signin(req, res) {
    if (req.method === 'GET') {
      res.render('form', {
        title: 'signin'
      })
      return
    }

    User
      .findOne({
        where: {
          username: req.body.username,
        }
      })
      .then(data => {
        if (!data) {
          throw new Error('Invalid username/password')
        }
        const isAuth = checkPassword(req.body.password, data.password)
        if (isAuth) {
          const {id, name, is_admin, balance} = data
          req.session.user = {
            id,
            name,
            is_admin,
            balance
          }
          const path = is_admin ? '/admin' : '/'
          res.redirect(path)
        } else {
          throw new Error('Invalid username/password')
        }
      })
      .catch(err => {
        const errArr = err.message.split(',\n')
        res.render('failed', {errMsg: errArr[0]})
      })
  }

  static signup(req, res) {
    if (req.method === 'GET') {
      res.render('form', {
        title: 'signup'
      })
      return
    }

    const {name, username, password} = req.body
    const user = {name, username, password}
    User
      .create(user)
      .then(data => {
        req.session.user = data
        const path = data.is_admin ? '/admin' : '/'
        res.redirect(path)
      })
      .catch(err => {
        const errArr = err.message.split(',\n')
        res.render('failed', {errMsg: errArr[0]})
      })
  }

  static signout(req, res) {
    req.session.destroy()
    res.redirect('/')
  }

  static findAll(req, res) {
    User
      .findAll({
        order: [['updatedAt', 'DESC']],
        attributes: ['id', 'name', 'balance']
      })
      .then(data => {
        data = data.filter(el => el.name !== 'admin')
        res.render('admin/user', {
          title: 'List User',
          data,
          parseCurrency
        })
      })
      .catch(err => {
        res.render('failed', {errMsg: err.message})
      })
  }

  static topup(req, res) {
    if (req.method === 'GET') {
      res.render('form', {title: null})
      return
    }

    const id = req.session.user.id
    const {balance} = req.body
    User
      .findByPk(id)
      .then(data => {
        const user = {
          balance: +data.balance + +req.body.balance
        }
        return User
          .update(user, {
            where: {
              id
            },
            fields: ['balance']
          })
      })
      .then(() => {
        req.session.user.balance += +balance
        res.redirect('/')
      })
      .catch(err => {
        res.render('failed', {errMsg: err.message})
      })
  }

  static change(req, res) {
    if (req.method === 'GET') {
      res.render('form', {
        title: 'change'
      })
      return
    }

    const {name, username, password} = req.body
    let dataContainer
    User
      .findAll({
        where: {
          username
        }
      })
      .then((data) => {
        if (data.length === 0) {
          throw new Error('Username not found')
        } else if (data[0].username === 'admin') {
          throw new Error('Access Restricted')
        } else if (data[0].name !== name) {
          throw new Error('Wrong name')
        }

        const newPass = {
          password: hashPassword(password)
        }

        const tempData = data[0]
        dataContainer = {
          id: tempData.id,
          name,
          is_admin: tempData.is_admin,
          balance: tempData.balance
        }
        return User
          .update(newPass, {
            where: {
              id:tempData.id
            },
            fields: ['password']
          })
      })
      .then(() => {
        req.session.user = dataContainer
        const path = dataContainer.is_admin ? '/admin' : '/'
        res.redirect(path)
      })
      .catch(err => {
        res.render('failed', {errMsg: err.message})
      })
  }

  static getFund(req, res) {
    const id = req.params.id
    let userName = ''
    User
      .findByPk(id)
      .then(data => {
        return data.getFunds()
      })
      .then(data => {
        userName = data.name
        const filteredData = []
        data.forEach(el => {
          if (el.UserFund.status !== 'Rejected') {
            filteredData.push({
              name: el.name,
              amount: el.UserFund.amount,
              status: el.UserFund.status
            })
          }
        });
        res.render('admin/user', {
          title: userName,
          data: filteredData,
          parseCurrency
        })
      })
      .catch(err => {
        res.render('failed', {errMsg: err.message})
      })
  }
}

module.exports = Controller