class Controller {
  static signin(req, res) {
    res.render('signin')
  }

  static signup(req, res) {
    res.render('signup')
  }
}

module.exports = Controller