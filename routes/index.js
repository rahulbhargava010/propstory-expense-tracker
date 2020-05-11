const express = require("express")
const path = require("path")

const Project = require("../models/Project")
const Expense = require("../models/Expense")
const City = require("../models/City")
const Company = require("../models/Company")
const router = express.Router()

const { ensureAuthenticated } = require('../config/auth')

let jwt = require('jsonwebtoken');
// let config = require('../config');
let middleware = require('../config/middleware');

//Welcome Page without login


// Home page after login
// Getting Projects and Cities
router.get('/dashboard', middleware.checkToken, async (req, res) => {
    let projects, expenses;
    await Project.find({}, (err, res) => {
        projects = res
    })

    await Expense.find({}, (err, res) => {
        expenses = res
    })

    await res.status(200).json({
        user : req.user,
        projects, 
        expenses
    })
})

// Add New City
router.post('/addCity', middleware.checkToken, (req, res) => {
     
    const cityInfo = new City({
        name: req.body.city,
        region: req.body.region
    })
    const city  = cityInfo.save()

    res.json({ city })
})

// Add New Company
router.post('/addCompany', middleware.checkToken, (req, res) => {
    console.log('coming insde addcompany');
    
    const companyInfo = new Company({
        name: req.body.company
    })
    const company  = companyInfo.save()

    res.json({ company })
})

// Get Cities
router.get('/getCities', (req, res) => {
    City.find({}, (err, result) => {
        res.json({ cities: result })
    })
})

// Get Companies
router.get('/getCompanies', (req, res) => {
    Company.find({}, (err, result) => {
        res.json({ companies: result })
    })
})

module.exports = router