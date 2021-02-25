const isAdmin = (req, res, next) => {
  const userSession = req.session.user
  if (!userSession || !userSession.is_admin) {
    res.redirect('/');
  }
  next();
}

const isLogin = (req, res, next) => {
  const userSession = req.session.user
  if (!userSession) {
    res.redirect('/');
  }
  next();
}

module.exports = {isAdmin, isLogin}