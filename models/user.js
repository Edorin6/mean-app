/**
 * @Author: Edryn Magcalas <Edorin6>
 * @Date:   17-May-2017
 * @Email:  edryn.magcalas@gmail.com
 * @Filename: user.js
 * @Last modified by:   Edorin6
 * @Last modified time: 18-May-2017
 * @License: Free
 */

// requires
const mongoose  = require('mongoose');
const bcrypt    = require('bcryptjs');

// local requires
const config    = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema({
  name: String,
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

// init User from UserSchema and export
const User = module.exports = mongoose.model('User', UserSchema)

// getUserById method
module.exports.getUserById = (id, callback) => {
  User.findById(id, callback)
}

// getUserByUsername method
module.exports.getUserByUsername = (username, callback) => {
  const query = { username:username }
  User.findOne(query, callback)
}

// addUser method
module.exports.addUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err
      newUser.password = hash
      newUser.save(callback)
    })
  })
}

// comparePassword method
module.exports.comparePassword = (candidatePassword, hashedPassword, callback) => {
  bcrypt.compare(candidatePassword, hashedPassword, (err, isMatch) => {
    if(err) throw err
    callback(null, isMatch)
  })
}
