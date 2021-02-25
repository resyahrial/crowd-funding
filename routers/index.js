const {Router} = require('express')

const {FundController, UserController} = require('../controllers')
const {isAdmin} = require('../middlewares')

const userRouter = require('./userRouter')
const fundRouter = require('./fundRouter')
const userfundRouter = require('./userfundRouter')

const router = Router()

router.get('/', FundController.home)
router.get('/signin', UserController.signin)
router.post('/signin', UserController.signin)
router.get('/signup', UserController.signup)
router.get('/signout', UserController.signout)

router.use(isAdmin)
//admin
router.get('/admin', (req, res) => {
  res.redirect('/admin/funds')
})
router.use('/admin/funds', fundRouter)
router.use('/admin/users', userRouter)
router.use('/admin/userfund', userfundRouter)

module.exports = router