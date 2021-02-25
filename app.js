const express = require('express')
const { join } = require('path');
const session = require('express-session')

const router = require('./routers')

const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true })) 
app.use(express.static(join(__dirname, 'public')));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use('/', router)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})