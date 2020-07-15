const express = require("express")
const mongoose = require("mongoose")
var path = require('path');
const session = require('express-session')
const passport = require('passport')
var cors = require('cors')
var bodyParser = require('body-parser');
var morgan = require('morgan');
const rateLimit = require("express-rate-limit");
var fs = require('fs')
const cron = require("node-cron");
const fetch = require('node-fetch');

require('dotenv').config()

require('./config/passport')(passport)

const app = express()
const router = express.Router()

//DB Config
const db = process.env.MONGO_URI;

//Mongoose Connection
mongoose.connect(db, { useNewUrlParser: true, useFindAndModify: false })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

//Bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(logger(process.env.NODE_ENV));

// create a write stream (in append mode)
// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'public/access-morgan.log'), { flags: 'a' })
 
// setup the logger
// app.use(morgan('combined', { stream: accessLogStream }))

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
//app.use('/exported-images', express.static('static'));
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


//App Limiter for security concerns 
//If someone is hitting login signup api fore more then 5 times that IP will be blocked for next 15 min
const loginRegisterAccountLimiter = rateLimit({
    windowMs: 10 * 65 * 1000, // 15 minute window
    max: 20, // start blocking after 5 requests
    message: {"error" : "Too many attempt for user's api, please try again after an hour"}
});
app.use('/users', loginRegisterAccountLimiter)

//routers to use by app
app.use('/api', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/expenses', require('./routes/expenses'))
app.use('/project', require('./routes/project'))
app.use('/campaign', require('./routes/campaign'))
app.use('/webhook', require('./routes/webhook'))
// app.use('/image', require('./routes/image'))

app.get('*', (req, res) => {    
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
})

const PORT = process.env.PORT || 3030

// app server connection
app.listen(PORT, (err, res) => {
    console.log("Port is running on Port " + PORT)
})