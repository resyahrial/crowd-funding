const {Router} = require('express')

const {UserController} = require('../controllers')

const router = Router()

router.get('/', UserController.findAll)
router.get('/signin', UserController.signin)
router.post('/signin', UserController.signin)
router.get('/signup', UserController.signup)
router.post('/signup', UserController.signup)
router.get('/signout', UserController.signout)

module.exports = router