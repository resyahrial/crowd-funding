const {Router} = require('express')

const {FundController} = require('../controllers')
const {uploadImage} = require('../middlewares')

const router = Router()

router.get('/', FundController.findAll)
router.get('/add', FundController.add)
router.post('/add', uploadImage, FundController.add)

module.exports = router