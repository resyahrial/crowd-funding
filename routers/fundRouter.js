const {Router} = require('express')

const {FundController} = require('../controllers')

const router = Router()

router.get('/', FundController.findAll)

module.exports = router