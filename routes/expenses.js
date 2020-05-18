const express = require("express")
const Expense = require("../models/Expense")
const { ObjectId } = require('mongodb');
var aws = require('aws-sdk');
const csv=require('csvtojson')
const AutomateExpensefb = require("../models/AutomateExpensefb")
const AutomateExpenseTaboola = require("../models/AutomateExpenseTaboola")

const router = express.Router()

// const { ensureAuthenticated } = require('../config/auth')

let middleware = require('../config/middleware');

var s3 = new aws.S3({ 
    accessKeyId: process.env.accessKeyId, 
    secretAccessKey: process.env.secretAccessKey 
});

var getParams = {
    Bucket: process.env.Bucket
}

// Adding/Edit Expense
// Need to add authentication later
router.post('/', middleware.checkToken, (req, res) => {
   
    const { project, user, campaignType, actualLeads, plannedLeads, totalBudget, cpl, clicks, impressions, totalSpending, spendingDate, campaignStartDate } = req.body;
    
    // console.log(req.body);
    
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
        const userID = ObjectId(user)
        console.log(req.body._id);
        
        if (req.body._id) {
            console.log('coming inside edit expense')
            // id is there then update row

            const filter = {_id: req.body._id }
            console.log(filter)
            // const filter = {_id: ObjectId(req.body._id)}
            const updateData = { project: projectID, campaignType, actualLeads, plannedLeads, totalBudget, cpl, clicks, impressions, totalSpending, spendingDate, campaignStartDate, updatedBy: userID }
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
                        project: projectID, campaignType, actualLeads, plannedLeads, totalBudget, cpl, clicks, impressions, totalSpending, spendingDate, campaignStartDate, updatedBy: userID, createdBy: userID

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

router.post('/delete', middleware.checkToken, (req, res) => {

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

//Get Files from S3 and then getObject and then push the data in mongo db
// need to write CRONJOB for this 
router.get('/fbexpense', middleware.checkToken, async (req, res) => {

    // const getFiles = {
    //     Bucket: 'stitchdb-bucket',
    //     Key: 'propstory_taboola_campaigns/campaign_performance/0_1589448960878.csv'
    // }

    // await s3.getObject(getFiles, function(err, data) {
    //     if (err) {
    //         console.log('error in getting content')
    //         msg.push({ err })
    //         res.status(400).json({ msg })
    //     } else {
    //         msg.push({ data })
    //         console.log('file body')
    //         res.status(200).json({ msg })
    //     }
    // })

    let msg = []
    await s3.listObjects(getParams, async (err, allObjects) => {
        if (err) {
            msg.push({ err })
            res.status(400).json({ msg })
        } else {
            if (allObjects && allObjects.Contents) {
                const allFiles = await allObjects.Contents.map( async (file) => {

                    const key     = file.Key
                    const today = new Date().getDate() - 1
                    let fileModifiedDate = new Date(file.LastModified).getDate()

                    if (today === fileModifiedDate && key) {

                        // console.log(today)
                        // console.log(key)
                        let getFiles = {
                            Bucket: process.env.Bucket, 
                            Key: key
                        }
                        // console.log(getFiles)
                        await s3.getObject(getFiles, async (err, data) => {
                            if (err) {
                                console.log('error in getting content')
                                msg.push({ err })
                            } else {
                                // console.log('file body')
                                if (data.Body && data.Body.toString()) {
                                    // console.log('file body')
                                    console.log(key)
                                    const cvsString = data.Body.toString()
                                    await csv()
                                    .fromString(cvsString)
                                    .then( async (jsonObj) => {
                                        console.log('jsonObj')
                                        let valuetopushtodb = ''
                                        if (key.includes("fb")) {
                                            pushFbDB = await jsonObj.map( (expenseRow) => {
                                                // console.log(expenseRow.account_id)
                                                return {
                                                    'account_id': expenseRow.account_id,
                                                    'account_name': expenseRow.account_name,
                                                    'campaign_id': expenseRow.campaign_id,
                                                    'campaign_name': expenseRow.campaign_name,
                                                    'spends': expenseRow.spent,
                                                    'clicks': expenseRow.clicks,
                                                    'reach': expenseRow.reach,
                                                    'impressions': expenseRow.impressions,
                                                    'unique_clicks': expenseRow.unique_clicks,
                                                    'cpc': expenseRow.cpc,
                                                    'cpp': expenseRow.cpp,
                                                    'cpm': expenseRow.cpm,
                                                    'ctr': expenseRow.ctr,
                                                    'date_start': expenseRow.date_start,
                                                }
                                            })

                                            // console.log(valuetopushtodb)

                                            await AutomateExpensefb.collection.insertMany(pushFbDB, (err, docs) => {
                                                if (err){ 
                                                    console.log('error in multiple submitted')
                                                    msg.push({ err })
                                                } else {
                                                    console.log('document submitted')
                                                    console.log(key)
                                                    msg.push({ success: "Multiple documents inserted to Collection" }, key)
                                                }
                                            });
                                        }  else if (key.includes("taboola")) {
                                            pushTaboolaDB = await jsonObj.map( (expenseRow) => {
                                                // console.log(expenseRow)
                                                return {
                                                    'campaign_id': expenseRow.campaign_id,
                                                    'spends': expenseRow.spent,
                                                    'clicks': expenseRow.clicks,
                                                    'impressions': expenseRow.impressions,
                                                    'unique_clicks': expenseRow.unique_clicks,
                                                    'cpc': expenseRow.cpc,
                                                    'cpp': expenseRow.cpp,
                                                    'cpm': expenseRow.cpm,
                                                    'ctr': expenseRow.ctr,
                                                    'date_start': expenseRow.date,
                                                }
                                            })

                                            // console.log(valuetopushtodb)

                                            await AutomateExpenseTaboola.collection.insertMany(pushTaboolaDB, (err, docs) => {
                                                if (err){ 
                                                    console.log('error in multiple submitted')
                                                    msg.push({ err })
                                                } else {
                                                    console.log('document submitted')
                                                    console.log(key)
                                                    msg.push({ success: "Multiple documents inserted to Collection" }, key)
                                                }
                                            });
                                        }
                                        // AutomateExpense.collection.insert(valuetopushtodb, (err, docs) => {
                                        //     if (err){ 
                                        //         console.log('error in multiple submitted')
                                        //         msg.push({ err })
                                        //     } else {
                                        //         console.log('document submitted')
                                        //         msg.push({ success: "Multiple documents inserted to Collection" }, key)
                                        //         // res.status(400).json({ msg })
                                        //         // console.log("Multiple documents inserted to Collection");
                                        //     }
                                        // });

                                        

                                    }).catch((err) => {
                                        console.log('error in file parse')
                                        msg.push({ err })
                                        res.status(400).json({ msg })
                                    })
                                }
                            }
                            res.status(200).json( { msg, "h":"h" } );
                        
                        })
                    }
                })
                res.status(200).json( { msg, "k":"k" } );
            } else {
                msg.push({ "err": "No data to push in our db" })
                res.status(200).json( { msg, "f":"f" } );
            }
            res.status(200).json( { msg, "g":"g" } );
            
        }
    });
})

router.get('/getAutomateExpenses', async (req, res) => {
    AutomateExpensefb.find({
        "date_start": { 
             '$gte': "2020-05-13T00:00:00.000Z", 
             '$lte': "2020-05-17T00:00:00.000Z"
         },
        //  project: ObjectId(project)
  }, (err, result) => {
      if(err) res.status(400).json({ 'err': err })
      res.status(200).json({ 'spendings': result })
 })
})

//Need to write CRONJOB for this
router.get("/deleteObjects", async (req, res) => {
    const today = new Date();
    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3);

    const todayDate = today.getDate()
    const lastWeekDate = lastWeek.getDate()

    console.log(lastWeek)
    let keys = []
    await s3.listObjects(getParams, async (err, allObjects) => {
        if (err) {
            msg.push({ err })
            res.status(400).json({ msg })
        } else {
            if (allObjects && allObjects.Contents) {
                await allObjects.Contents.map( async (file) => {
                    // console.log(file);
                    
                    let fileModifiedDate = new Date(file.LastModified)
                    // console.log(fileModifiedDate)
                    if(lastWeek >= fileModifiedDate) {
                        keys.push( { Key: file.Key })
                        // console.log(file.Key)
                        // console.log(fileModifiedDate)
                    }
                    // let fileModifiedDate = new Date(file.LastModified).getDate()
                })

                if (keys) { 
                    let params = {
                        Bucket: process.env.Bucket, 
                        Delete: {
                            Objects: keys, 
                            Quiet: false
                        }
                    };
                    await s3.deleteObjects(params, function(err, data) {
                        if (err) console.log(err, err.stack); // an error occurred
                        else     console.log(data);           // successful response
                    });
                }
                // console.log(keys)
            }
        }
    })
    res.json(200).json( { "lastWeek": lastWeek })
})

module.exports = router