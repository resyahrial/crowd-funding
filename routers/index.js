const {Router} = require('express')

const {FundController, UserFundController} = require('../controllers')
const {isAdmin} = require('../middlewares')

const userRouter = require('./userRouter')
const fundRouter = require('./fundRouter')
const userfundRouter = require('./userfundRouter')

const router = Router()

router.get('/', FundController.home)
router.use('/', userRouter)
router.post('/userfund/buy', UserFundController.buy)

router.use(isAdmin)
//admin
router.get('/admin', (req, res) => {
  res.redirect('/admin/funds')
})
router.use('/admin/funds', fundRouter)
router.use('/admin/users', userRouter)
router.use('/admin/userfund', userfundRouter)

module.exports = router