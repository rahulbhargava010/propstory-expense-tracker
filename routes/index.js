const express = require("express")
const Project = require("../models/Project")
const Expense = require("../models/Expense")
const City = require("../models/City")
const Company = require("../models/Company")
const router = express.Router()

const { ensureAuthenticated } = require('../config/auth')

//Welcome Page without login
router.get('/', (req, res) => {
    res.json({
        'msg' : 'success'
    })
})

// Home page after login
// Getting Projects and Cities
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
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
router.post('/addCity', ensureAuthenticated, (req, res) => { 
    const cityInfo = new City({
        name: req.body.city,
        region: req.body.region
    })
    const city  = cityInfo.save()

    res.json({ city })
})

// Add New Company
router.post('/addCompany', ensureAuthenticated, (req, res) => { 
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