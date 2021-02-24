const {Router} = require('express')

const {FundController} = require('../controllers')
const {uploadImage} = require('../middlewares')

const router = Router()

router.get('/', FundController.findAll)
router.get('/add', FundController.add)
router.post('/add', uploadImage, FundController.add)
router.get('/edit/:id', FundController.edit)
router.post('/edit/:id', uploadImage, FundController.edit)
router.get('/delete/:id', FundController.delete)
router.get('/:id/users', FundController.users)

module.exports = router