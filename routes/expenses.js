const express = require("express")
const Expense = require("../models/Expense")
const { ObjectId } = require('mongodb');

const router = express.Router()

const { ensureAuthenticated } = require('../config/auth')


// Adding new expense Sheet
router.post('/', (req, res) => {
    console.log("ADDING EXPENSE");
    
    const { project, campaignType, actualLeads, plannedLeads, totalBudget, cpl, clicks, impressions, totalSpending, spendingDate, campaignStartDate } = req.body;
    console.log(req.body);
    
    let errors = []

    if (!project || !campaignType || !actualLeads || !totalSpending) {
        errors.push({ msg: 'Please fill all required fields' })
    }


    if (errors.length > 0) {
        res.status(400).json({ errors })
    } else {
        //validation Passes
        const projectID = ObjectId(project)
        Expense.findOne( { project: projectID, campaignType: campaignType, spendingDate: spendingDate } )
        .then( (expense) => {
            if (expense) {
                errors.push( { msg: "Expense already exist for this date" })
                res.status(400).json({ errors })
            } else {
                // console.log(projectID)
                const newExpense = new Expense({
                    project: projectID, campaignType, actualLeads, plannedLeads, totalBudget, cpl, clicks, impressions, totalSpending, spendingDate, campaignStartDate

                })

                console.log(newExpense)
                
                newExpense.save()
                .then(expense => {
                    // req.flash(
                    //     'success_msg',
                    //     'Your Expense tracker has ben saved'
                    // );
                    res.status(201).json({ msg: 'Your Expense tracker has been saved' })
                })
                .catch(err => console.log(err))
            }
        });
    }
})

module.exports = router