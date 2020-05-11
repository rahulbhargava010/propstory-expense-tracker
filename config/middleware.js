let jwt = require('jsonwebtoken');
const User = require("../models/User")
const bcrypt = require("bcryptjs")

let checkToken = (req, res, next) => {
    console.log("IN CHECK TOKEN 12");
    console.log(req.headers);
    
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token) {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                console.log("COMING INSIDE SUCCSEE" );
                
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
}

const findUserByCredentials = async (req, res, next) => {
    try {
        let email = req.body.email;
        let password = req.body.password;

        if (email && password) {
            User.findOne ({ email: email })
            .then((user) => {
                if(!user) {
                    res.status(400).json({ error: 'That email is not registered' })
                }
                //Match Password
                if (!user.enable) {
                    res.status(400).json({ error: 'Your account isn\'t activated yet. Please Connect your admin' })
                } else {
                    bcrypt.compare(password, user.password, async (err, isMatch) => {
                        if(err) res.status(400).json({ error: 'Password Incorrect' });

                        if(isMatch) {
                            req.user = user
                            next();
                        } else {
                            res.status(400).json({ error: 'Password Incorrect' })
                        }
                    })
                }
            })
            .catch(err => console.log(err))
        }
    } catch(e) {
        res.status('400').send(e)
    }
}


module.exports = {
  checkToken: checkToken,
  findUserByCredentials
}