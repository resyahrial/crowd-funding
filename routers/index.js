const {Router} = require('express')

const userRouter = require('./userRouter')
const fundRouter = require('./fundRouter')

const router = Router()

router.get('/', (req, res) => {
  res.send('Hello World!')
})

router.use('/funds', fundRouter)

module.exports = router