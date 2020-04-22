const localStratergy = require('passport-local')
const bcrypt = require('bcryptjs')

const User = require("../models/User")

module.exports = (passport) => {
    passport.use(
        new localStratergy({ usernameField: 'email'}, (email, password, done) => {
            //Match User
            User.findOne({ email: email})
            .then((user) => {
                if(!user) {
                    return done(null, false, {message: 'That email is not registered'})
                }
                //Match Password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;

                    if(isMatch) {
                        return done(null, user)
                    } else {
                        return done(null, false, { message: 'Password Incorrect' })
                    }
                })
            })
            .catch(err => console.log(err))
        })
    )

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
    });
}