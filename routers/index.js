const {Router} = require('express')

const {FundController, AuthController} = require('../controllers')

const userRouter = require('./userRouter')
const fundRouter = require('./fundRouter')

const router = Router()

router.get('/', FundController.home)
router.get('/signin', AuthController.signin)
router.get('/signup', AuthController.signup)

//admin
router.get('/admin', (req, res) => {
  res.redirect('/admin/funds')
})
router.use('/admin/funds', fundRouter)

module.exports = router