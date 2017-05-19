/**
 * @Author: Edryn Magcalas <Edorin6>
 * @Date:   17-May-2017
 * @Email:  edryn.magcalas@gmail.com
 * @Filename: app.js
 * @Last modified by:   Edorin6
 * @Last modified time: 19-May-2017
 * @License: Free
 */

// requires
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')
const mongoose = require('mongoose')

// local requires
const config = require('./config/database');
const users = require('./routes/users')

// connect to Database
mongoose.connect(config.database)
mongoose.connection.on('connected', () => { // on Connected
  console.log('Connected to database ' + config.database)
})
mongoose.connection.on('error', (err) => { // on Error
  console.log('Database error: ' + err)
})

// init App
const app = express()
const port = 3000

// Middleware CORS
app.use(cors())

// Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Middleware Body Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// Middleware Passport
app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

// users Routes
app.use('/users', users)

// index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint')
})

// listen for requests
app.listen(port, () => {
  console.log('Server started on port ' + port)
})
