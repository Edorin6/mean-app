/**
 * @Author: Edryn Magcalas <Edorin6>
 * @Date:   18-May-2017
 * @Email:  edryn.magcalas@gmail.com
 * @Filename: passport.js
 * @Last modified by:   Edorin6
 * @Last modified time: 18-May-2017
 * @License: Free
 */

// requires
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

// local requires
const User = require('../models/user')
const config = require('../config/database')

module.exports = (passport) => {
  let opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader()
  opts.secretOrKey = config.secret
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log(jwt_payload);
    User.getUserById(jwt_payload._doc._id, (err, user) => {
      if(err) { return done(err, false) }
      if(user) { return done(null, user) } else { return done(null, false) }
    })
  }))
}
