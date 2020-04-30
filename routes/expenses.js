const express = require("express")
const Expense = require("../models/Expense")
const { ObjectId } = require('mongodb');
var aws = require('aws-sdk');
var fs = require("fs")
var path = require('path')
const csv=require('csvtojson')
const router = express.Router()

const { ensureAuthenticated } = require('../config/auth')

// var config = require('../../config/environment/' + process.env.NODE_ENV); // require you config file

var s3 = new aws.S3({ 
    accessKeyId: 'AKIAIGJ5VYSE5NHUFPQA', 
    secretAccessKey: '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' 
});

var getParams = {
    Bucket: 'stitchdb-bucket', 
    Key: 'propstory_fb_ads/ads_insights/0_1588236887114.csv'
}
// Adding/Edit Expense
// Need to add authentication later
router.post('/', (req, res) => {
   
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
        console.log('coming inside new/edit expense')

        const projectID = ObjectId(project)
        console.log(req.body._id);
        
        if (req.body._id) {
            console.log('coming inside edit expense')
            // id is there then update row

            const filter = {_id: req.body._id }
            console.log(filter)
            // const filter = {_id: ObjectId(req.body._id)}
            const updateData = { project: projectID, campaignType, actualLeads, plannedLeads, totalBudget, cpl, clicks, impressions, totalSpending, spendingDate, campaignStartDate }
            console.log();
            
            Expense.findOneAndUpdate( filter, updateData, { returnOriginal: false} )
            .then( (expense) => {
                console.log('coming inside edit successfully')
                res.status(200).json({ msg: 'Your Expense tracker has been updated successfully', expense })
            })
            .catch(err => {
                console.log('coming inside error')
                errors.push( { msg: err })
                res.status(400).json({ errors })
            })

        } else {
            console.log('coming inside new expense')
            Expense.findOne( { project: projectID, campaignType: campaignType, spendingDate: spendingDate } )
            .then( (expense) => {
                if (expense) {
                    errors.push( { msg: "Expense already exist for this date" })
                    res.status(400).json({ errors })
                } else {
                    const newExpense = new Expense({
                        project: projectID, campaignType, actualLeads, plannedLeads, totalBudget, cpl, clicks, impressions, totalSpending, spendingDate, campaignStartDate

                    })
                    newExpense.save()
                    .then(expense => {
                        res.status(201).json({ msg: 'Your Expense tracker has been saved successfully' })
                    })
                    .catch(err => console.log(err))
                }
            });
        }
    }
})

router.post('/delete', (req, res) => {

    const deleteExpense = {_id: ObjectId(req.body._id)}
    Expense.findOneAndRemove( deleteExpense )
    .then( (result) => {
        console.log('coming inside delete success')
        res.status(200).json({ msg: 'Your Expense has been deleted successfully' })
    }).catch((err)=>{
        console.log('coming inside delete error')
        errors.push( { msg: err })
        res.status(400).json({ errors })
    })
})

router.get('/fbexpense', (req, res) => {

    s3.getObject(getParams, (err, bucketData) => {

        if (err) {
            res.status(400).json({ "err" : err });
        } else {
            const cvsString = bucketData.Body.toString()

            csv({
                noheader:true,
                output: "csv",
                // output: "line"
            })
            .fromString(cvsString)
            // .subscribe((cvsLine) => {
            //     console.log(cvsLine)
            //     res.status(200).json( cvsLine )
            // })
            .then((jsonObj)=>{
                console.log(jsonObj);
                res.status(200).json( { "file" :  jsonObj } )
            }).catch((error) => {
                res.status(400).json( { "error" : error } );
            })
        }
    
    })
})

module.exports = router