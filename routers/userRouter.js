const {Router} = require('express')

const {UserController} = require('../controllers')

const router = Router()

router.get('/', UserController.findAll)

module.exports = router