const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const User = require("../models/User")

let jwt = require('jsonwebtoken');
let middleware = require('../config/middleware');

// working properly as of 01 may 2020 
// need to add fields like emailConfirmation, lastLogin, enable, company, createdAt, updatedAt
// add last login field
router.post('/register', (req, res) => {

    const { name, email, password, password2, company } = req.body;
    
    let errors = []

    if (!name || !email || !password || !password2 || !company) {
        errors.push({ msg: 'Please fill all the fields' })
    }

    if (password !== password2) {
        errors.push({ msg: "Your Password and Confirm Password didn't match" })
    }

    if (password.length < 6 ) {
        errors.push({ msg: "Password should be atleast 6 characters" })
    }

    if (errors.length > 0) {
        res.status(400).json({ errors })
    } else {
        //validation Passes
        User.findOne( {email: email} )
        .then( (user) => {
            if (user) {
                errors.push( { msg: "Email is already registered" })
                res.status(400).json({ errors })
            } else {
                const newUser = new User({
                    name,
                    email,
                    password,
                    company
                })
                
                //hashed password
                bcrypt.genSalt(8, (error, salt) => {
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if(error) {
                            errors.push( { msg: "Password hashing issue" })
                            res.status(400).json({ errors })
                        }
                        newUser.password = hash
                        newUser.save()
                        .then(user => {
                            res.status(201).json({
                                msg: "You are now registered and can log in",
                                user
                            })
                        })
                        .catch(err => console.log(err))
                    })
                })
            }
        });
    }
})

router.post('/login', middleware.findUserByCredentials, async (req, res, next) => {
    // console.log("IN LOGIN API");
    // console.log(req.user)
    // console.log('--------------token');    
    // console.log(process.env.ACCESS_TOKEN_SECRET)
    if (req.user) {
        
        let token = jwt.sign({ email: req.body.email },
            process.env.ACCESS_TOKEN_SECRET,
            { 
                expiresIn: '24h' // expires in 24 hours
            }
        );

        res.status('200').send({ 
            success: true,
            message: 'Authentication successful!',
            token,
            user: req.user
        })

    } else {
        res.status('403').send({
            success: false,
            message: 'Incorrect username or password'
        });
    }


})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Logged out successfully')
    res.status(200).json({
        msg: "logged out successfully"
    })
})

module.exports = router