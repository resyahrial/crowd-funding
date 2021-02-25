const {UserFund, User} = require('../models')

class Controller {
  static verify(req, res) {
    const id = req.params.id
    let fundId
    UserFund
      .findOne({
        where: {
          transaction_id: id
        }
      })
      .then((data) => {
        fundId = data.FundId
        const userfund = {
          status: 'Verified'
        }
        return UserFund
          .update(userfund, {
            where: {
              transaction_id: id
            },
            fields: ['status']
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
      .findOne({
        where: {
          transaction_id: id
        }
      })
      .then((data) => {
        const userfund = {
          status: 'Rejected'
        }
        fundId = data.FundId
        userId = data.UserId
        rejectedAmount = data.amount
        return UserFund
          .update(userfund, {
            where: {
              transaction_id: id
            },
            fields: ['status']
          })
      })
      .then(() => {
        return User.findByPk(userId)
      })
      .then((userData) => {
        const newData = {
          balance: userData.balance + rejectedAmount
        }
        return User
          .update(newData, {
            where: {
              id: userId
            },
            fields: ['balance']
          })
      })
      .then(() => {
        res.redirect(`/admin/funds/${fundId}/users`)
      })
      .catch(err => {
        res.send(err)
      })
  }

  static buy(req, res) {
    const {FundId, amount} = req.body
    const buyAmount = +amount * 1e6
    if (+req.session.user.balance < buyAmount) {
      res.send('Balance not enough, please top up first')
      return
    }
    
    const UserId = req.session.user.id
    const userfund = {
      UserId: UserId,
      FundId: +FundId,
      amount: buyAmount
    }
    UserFund
      .create(userfund)
      .then(() => {
        return User.findByPk(UserId)
      })
      .then(data => {
        const user = {
          balance: +data.balance - buyAmount
        }
        return User
          .update(user, {
            where: {
              id: UserId
            },
            fields: ['balance']
          })
      })
      .then(() => {
        req.session.user.balance -= buyAmount
        res.redirect('/')
      })
      .catch(err => {
        res.send(err)
      })
  }
}

module.exports = Controller