const express = require("express")
const Expense = require("../models/Expense")
const Project = require("../models/Project")
const User = require("../models/User")
const router = express.Router()
const { ObjectId } = require('mongodb');

// const { ensureAuthenticated } = require('../config/auth')
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

router.post('/getProjects', middleware.checkToken, (req, res) => {
    
    const user_id = req.body.user_id
    const company_id = req.body.company_id

    User.findById(user_id, (err, user) => {
        if(err) console.log(err)
        
        if(user.role == 'PSADMIN') {
            Project.find({}, (err, result) => {
                res.status(200).json({ projects: result })
            })
        } else if(user.role == 'ADMIN') {
            const filter = {company: company_id }
            Project.find(filter, (err, result) => {
                res.status(200).json({ projects: result })
            })
        } else {
            res.status(200).json({ msg: 'there are no project assigned to you plz contect your admin' })
        }
        
    })
 

})

// Getting campaign data b/w Dates
router.post('/projectData', (req, res) => {
 
    
    let errors = [], expenses
    const { startDate, endDate, project } = req.body
    // res.json({'body': req.body})
    if (!startDate || !endDate || !project) {
        errors.push({ msg: 'Please fill all the fields' })
    }

     Expense.find({
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