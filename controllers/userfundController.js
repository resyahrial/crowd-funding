const {UserFund, User} = require('../models')

class Controller {
  static verify(req, res) {
    const id = req.params.id
    let fundId
    UserFund
      .findAll({
        where: {
          id
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      })
      .then((data) => {
        data.status = 'Verified'
        fundId = data[0].FundId
        return UserFund
          .update(data, {
            where: {
              id
            }
          })
      })
      .then(() => {
        res.redirect(`/admin/funds/${fundId}/users`)
      })
      .catch(err => {
        res.send(err)
      })
  }

  static reject(req, res) {
    const id = req.params.id
    let userId, fundId, rejectedAmount
    UserFund
      .findAll({
        where: {
          id
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      })
      .then((data) => {
        data.status = 'Rejected'
        fundId = data[0].FundId
        userId = data[0].UserId
        rejectedAmount = data[0].amount
        return UserFund
          .update(data, {
            where: {
              id
            }
          })
      })
      .then(() => {
        return User
          .findByPk(userId, {
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          })
      })
      .then((userData) => {
        userData.balance += rejectedAmount
        const {username, password, is_admin, name, balance} = userData
        const newData = {username, password, is_admin, name, balance}
        return User
          .update(newData, {
            where: {
              id: userId
            }
          })
      })
      .then(() => {
        res.redirect(`/admin/funds/${fundId}/users`)
      })
      .catch(err => {
        res.send(err)
      })
  }
}

module.exports = Controller