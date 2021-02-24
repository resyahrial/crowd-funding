const {Router} = require('express')

const {FundController, AuthController} = require('../controllers')

const userRouter = require('./userRouter')
const fundRouter = require('./fundRouter')
const userfundRouter = require('./userfundRouter')

const router = Router()

router.get('/', FundController.home)
router.get('/signin', AuthController.signin)
router.get('/signup', AuthController.signup)

//admin
router.get('/admin', (req, res) => {
  res.redirect('/admin/funds')
})
router.use('/admin/funds', fundRouter)
router.use('/admin/users', userRouter)
router.use('/admin/userfund', userfundRouter)

module.exports = router