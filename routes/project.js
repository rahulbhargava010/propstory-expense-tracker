const express = require("express")
const Expense = require("../models/Expense")
const Project = require("../models/Project")
const router = express.Router()
const { ObjectId } = require('mongodb');

const { ensureAuthenticated } = require('../config/auth')
let middleware = require('../config/middleware');

//Adding a new Project
router.post('/addProject', middleware.checkToken, (req, res) => {
    const projectInfo = new Project({
        name: req.body.project,
        city: ObjectId(req.body.city),
        company: ObjectId(req.body.company)
    })
    const project  = projectInfo.save()

    res.status(201).json({ project })
})

router.get('/getProjects', middleware.checkToken, (req, res) => {

    Project.find({}, (err, result) => {
        res.status(200).json({ projects: result })
    })

})

// Getting campaign data b/w Dates
router.post('/projectData', middleware.checkToken, async (req, res) => {
    let errors = [], expenses
    const { startDate, endDate, project } = req.body
    // res.json({'body': req.body})
    if (!startDate || !endDate || !project) {
        errors.push({ msg: 'Please fill all the fields' })
    }

    await Expense.find({
           "spendingDate": { 
                '$gte': startDate, 
                '$lte': endDate
            },
            project: ObjectId(project)
     }, (err, result) => {
        res.status(200).json({ 'spendings': result })
    })
})

module.exports = router