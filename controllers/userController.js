const {User} = require('../models')
const {parseCurrency, checkPassword} = require('../helpers')

class Controller {
  static signin(req, res) {
    if (req.method === 'GET') {
      res.render('auth', {
        title: 'signin'
      })
      return
    }

    User
      .findOne({
        where: {
          username: req.body.username
        }
      })
      .then(data => {
        if (!data) {
          throw new Error('Invalid username/password')
        }
        const isAuth = checkPassword(req.body.password, data.password)
        if (isAuth) {
          const {id, name, is_admin} = data
          req.session.user = {
            id,
            name,
            is_admin
          }
          const path = is_admin ? '/admin' : '/'
          res.redirect(path)
        } else {
          throw new Error('Invalid username/password')
        }
      })
      .catch(err => {
        res.send(err.message)
      })
  }

  static signup(req, res) {
    if (req.method === 'GET') {
      res.render('auth', {
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
        res.send(errArr[0])
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