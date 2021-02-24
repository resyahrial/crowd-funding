const {Router} = require('express')

const {UserFundController} = require('../controllers')

const router = Router()

router.get('/verify/:id', UserFundController.verify)
router.get('/reject/:id', UserFundController.reject)

module.exports = router