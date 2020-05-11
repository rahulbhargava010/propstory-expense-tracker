const express = require("express")
const mongoose = require("mongoose")
var path = require('path');
const session = require('express-session')
const passport = require('passport')
var cors = require('cors')
var bodyParser = require('body-parser');
var logger = require('morgan');
require('dotenv').config()

require('./config/passport')(passport)

const app = express()

//DB Config
const db = process.env.MONGO_URI;

//Mongoose Connection
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

//Bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(logger(process.env.NODE_ENV));

//Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(cors())
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))
//app.use(express.static("client/build/"));

//Connect flash
// app.use(flash())

//Global Vars
// app.use((req, res, next) => {
//     res.locals.success_msg = req.flash('success_msg')
//     res.locals.error_msg = req.flash('error_msg')
//     res.locals.error = req.flash('error')
//     next()
// })

//using local public folder as a root for assets
// app.use(express.static(path.join(__dirname, 'public')))

//routers to use by app
app.use('/api', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/expenses', require('./routes/expenses'))
app.use('/project', require('./routes/project'))

app.get('*', (req, res) => {    
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
})

const PORT = process.env.PORT || 3050

// app server connection
app.listen(PORT, (err, res) => {
    console.log("Port is running on Port " + PORT)
})