const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const Project = require("../models/Project")
const sendGridActivationMailSend  = require("../helper/sendGridMail")
const { ObjectId } = require('mongodb');

let jwt = require('jsonwebtoken');
let middleware = require('../config/middleware');

// working properly as of 01 may 2020 
// need to add fields like emailConfirmation, lastLogin, enable, company, createdAt, updatedAt
// add last login field
router.post('/register', (req, res) => {

    const { name, password, password2, company } = req.body;
    
    const email = req.body.email.trim().toLowerCase();

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
    // console.log(req.body.email)
    // console.log(req.body.email.trim().toLowerCase())
    if (req.user) {
        
        let token = jwt.sign({ email: req.body.email.trim().toLowerCase() },
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

router.post('/getUsers', middleware.checkToken, async (req, res) => {
    const user_id = req.body.user_id
    if (user_id) {
        User.findById(user_id, (err, user) => {
            if(err) console.log(err)
            
            if(user.role == 'PSADMIN') {
                User.find({}, (err, users) => {
                    if (err) {
                        res.status('403').send({
                            success: false,
                            message: 'You are not Authorize'
                        });
                    }
        
                    res.status('200').send({ 
                        success: true,
                        user: users
                    })
                })
            } else {
                res.status('403').send({
                    success: false,
                    message: 'You are not Admin'
                });
            }
        })
        
    } else {
        res.status('403').send({
            success: false,
            message: 'Please pass UserID'
        });
    }
})

router.post('/getCompanyUsers', middleware.checkToken, async (req, res) => {
    const user_id = req.body.user_id
    const company_id = req.body.company_id
    if (user_id) {
        User.findById(user_id, (err, user) => {
            if(err) console.log(err)
            
            if(user.role == 'PSADMIN') {
                let filter = { company: ObjectId(company_id)}
                User.find(filter, (err, users) => {
                    if (err) {
                        res.status('403').send({
                            success: false,
                            message: 'You are not Authorize'
                        });
                    }
        
                    res.status('200').send({ 
                        success: true,
                        user: users
                    })
                })
            } else {
                res.status('403').send({
                    success: false,
                    message: 'You are not Admin'
                });
            }
        })
        
    } else {
        res.status('403').send({
            success: false,
            message: 'Please pass UserID'
        });
    }
})

router.post('/makeAdmin', middleware.checkToken, async (req, res) => {
    // console.log('get all users')
    const user_id = req.body.user_id
    const admin_id = req.body.admin_id
    console.log(user_id)
    //check role of the user
    // one who is making admin
    // whom we making admin 
    if (user_id) {
        User.findById(user_id, (err, user) => {
            if(err) console.log(err)
            
            if(user.role == 'ADMIN' || user.role == 'PSADMIN') {
                User.findByIdAndUpdate(admin_id, { role: 'ADMIN'}, {new: true}, (err, adminuser) => {
                    if (err) {
                        res.status('403').send({
                            success: false,
                            message: 'You are not Authorize '
                        });
                    }

                    res.status('200').send({ 
                        success: true,
                        user: adminuser
                    })
                })
            }  else {
                res.status('403').send({
                    success: false,
                    message: 'You are not Admin'
                });
            }
        })
    } else {
        res.status('403').send({
            success: false,
            message: 'You are not Authorize'
        });
    }
})

router.post('/changeUserStatus', (req, res) => {
    const user_id = req.body.user_id
    const status = req.body.status
    User.findByIdAndUpdate(user_id, { enable: status }, {new: true}, (err, adminuser) => {
        if (err) {
            res.status('403').send({
                success: false,
                message: 'User not Found'
            });
        }
        
        const isEnable = adminuser.enable
        if (isEnable) {
            const email = adminuser.email
            sendGridActivationMailSend(email)
        }
        
        // console.log(adminuser)
        res.status('200').send({ 
            success: true,
            user: adminuser
        })
    })
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Logged out successfully')
    res.status(200).json({
        msg: "logged out successfully"
    })
})

module.exports = router