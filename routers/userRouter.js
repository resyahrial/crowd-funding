const {Router} = require('express')

const {UserController} = require('../controllers')
const {isLogin} = require('../middlewares')

const router = Router()

router.get('/signin', UserController.signin)
router.post('/signin', UserController.signin)
router.get('/signup', UserController.signup)
router.post('/signup', UserController.signup)
router.get('/change', UserController.change)
router.post('/change', UserController.change)

router.use(isLogin)
router.get('/topup', UserController.topup)
router.post('/topup', UserController.topup)
router.get('/signout', UserController.signout)

module.exports = router