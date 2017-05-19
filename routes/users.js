/**
 * @Author: Edryn Magcalas <Edorin>
 * @Date:   17-May-2017
 * @Email:  edryn.magcalas@gmail.com
 * @Filename: users.js
 * @Last modified by:   Edorin6
 * @Last modified time: 19-May-2017
 * @License: Free
 */

// requires
const express   = require('express')
const passport  = require('passport')
const jwt       = require('jsonwebtoken')

// local requires
const User      = require('../models/user')
const config    = require('../config/database')

// init router
const router = express.Router()

// Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  })

  User.addUser(newUser, (err, user) => {
    if(err) {
      console.log(err);
      res.json({success: false, msg: 'Failed to register user'})
    } else {
      res.json({success: true, msg: 'User registered'})
    }
  })

})

// Authenticate
router.post('/auth', (req, res, next) => {
  const username = req.body.username
  const password = req.body.password

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err
    if(!user) {
      return res.json({success: false, msg: 'User not found'})
    } else {
      User.comparePassword(password, user.password, (err, isMatch) => {
        if(err) throw err
        if(isMatch) {
          const token = jwt.sign(user, config.secret, {
            expiresIn: 604800 // 1 week
          })
          // send response
          res.json({
            success: true,
            token: 'JWT ' + token,
            user: {
              id: user._id,
              name: user.name,
              username: user.username,
              email: user.email
            }
          })
        } else {
          return res.json({success: false, msg: 'Wrong password'})
        }
      })
    }

  })
})

// Profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json({user: req.user})
})


module.exports = router
