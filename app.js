const express           = require("express")
// const expressLayouts    = require("express-ejs-layouts")
const mongoose          = require("mongoose")
var path                = require('path');
// var flash               = require('connect-flash')
const session           = require('express-session')
const passport          = require('passport')
var cors            = require('cors')
var bodyParser = require('body-parser');

require('./config/passport')(passport)

const app = express()

//DB Config
const db = require("./config/keys").MongoURI;

//Mongoose Connection
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

// app.use(expressLayouts)
// app.set('view engine', 'ejs')

//Bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }))

//Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(cors())
app.use(passport.initialize())
app.use(passport.session())

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
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/expenses', require('./routes/expenses'))
app.use('/project', require('./routes/project'))
app.use(express.static("./client/build"));
const PORT = process.env.PORT || 3050

// app server connection
app.listen(PORT, (err, res) => {
    console.log("Port is running on Port " + PORT)
})