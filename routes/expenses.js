const express = require("express")
const Expense = require("../models/Expense")
const { ObjectId } = require('mongodb');
var aws = require('aws-sdk');
const csv=require('csvtojson')
const AutomateExpensefb = require("../models/AutomateExpensefb")
const AutomateExpenseTaboola = require("../models/AutomateExpenseTaboola")

const FBCampaign = require('../models/FacebookCampaign')
const TaboolaCampaign = require('../models/TaboolaCampaign')

const router = express.Router()

const cron = require("node-cron");
// const { ensureAuthenticated } = require('../config/auth')

let middleware = require('../config/middleware');

var s3 = new aws.S3({ 
    accessKeyId: process.env.accessKeyId, 
    secretAccessKey: process.env.secretAccessKey 
});

var getObjects = {
    Bucket: process.env.Bucket
}

// Adding/Edit Expense
// Need to add authentication later
router.post('/', middleware.checkToken, (req, res) => {
   
    const { project, user, campaignType, actualLeads, allocation, plannedLeads, totalBudget, cpl, clicks, impressions, totalSpending, campaignName, spendingDate, campaignStartDate } = req.body;
    
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
        const userID = ObjectId(user)
        console.log(req.body._id);
        
        if (req.body._id) {
            console.log('coming inside edit expense')
            // id is there then update row

            const filter = {_id: req.body._id }
            console.log(filter)
            // const filter = {_id: ObjectId(req.body._id)}
            const updateData = { project: projectID, campaignType, actualLeads, allocation, plannedLeads, totalBudget, cpl, clicks, impressions, campaign: campaignName, totalSpending, spendingDate, campaignStartDate, updatedBy: userID }
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
                    const campaign_name = campaignName.length > 0 ? campaignName : null 
                    const newExpense = new Expense({
                        project: projectID, campaignType, actualLeads, allocation, plannedLeads, totalBudget, cpl, clicks, impressions, totalSpending, campaign: campaign_name, spendingDate, campaignStartDate, updatedBy: userID, createdBy: userID

                    })
                    console.log("NEW EXPENSE");
                    
                    console.log(newExpense);
                    
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

router.post('/updateAllocation', (req, res) => {
    // console.log(req.body.expense_id)
    // console.log(req.body.allocation)

    const rowId = req.body.expense_id
    const updateRow = { allocation: req.body.allocation }
    Expense.findByIdAndUpdate(rowId, updateRow, (err, res) => {
        if(err) console.log(err)
        else console.log(res)
    })
    res.status(200).json( {'msg': 'row updated successfully'})
})

router.post('/delete', middleware.checkToken, (req, res) => {

    // const deleteExpense = {_id: ObjectId(req.body._id)}
    // findOneAndRemove
    // AutomateExpensefb
    // const deleteExpense = { "date_start" : "2020-05-23T00:00:00.000Z" }
    // AutomateExpensefb.deleteMany( deleteExpense )
    // .then( (result) => {
    //     console.log('coming inside delete success')
    //     res.status(200).json({ msg: 'Your Expense has been deleted successfully', result })
    // }).catch((err)=>{
    //     console.log('coming inside delete error')
    //     errors.push( { msg: err })
    //     res.status(400).json({ errors })
    // })

    const deleteExpense = {_id: ObjectId(req.body._id)}
    Expense.findOneAndRemove( deleteExpense )
    .then( (result) => {
        console.log('coming inside delete success')
        res.status(200).json({ msg: 'Your Expense has been deleted successfully', result })
    }).catch((err)=>{
        console.log('coming inside delete error')
        errors.push( { msg: err })
    })
})

// Get Files from S3 and then getObject and then push the data in mongo db -- done
// need to write CRONJOB for this 
// add campaign data to db for taboola and fb
const automateExpenseUpdateInDB = async (req, res) => {

    console.log('cron job for')
    console.log(new Date().getDate())
    let objects = null;
    await new Promise((resolve) => {
        s3.listObjects(getObjects, (err, allObjects) => {
            if(err) {
                res.status(400).json({ 'msg': 'error while geting objects', err })
            }

            if (allObjects && allObjects.Contents) {
                objects = allObjects.Contents
                resolve(console.log('list objects resolve'));
            }
        })
    })

    
    // console.log('list objects method end');
    // console.log('*****************')
    let CSVStringArray = []
    if (objects) {
        for (let i = 0; i < objects.length; i++) {
            let file = objects[i]
            const key = file.Key
            //added files till 26th of may
            const today = new Date().getDate() - 10
            console.log(today)
            let fileModifiedDate = new Date(file.LastModified).getDate()
            if (today === fileModifiedDate && key !== "stitch-challenge-file-djpTyLmyPFRpF2RsAEyP01Rc") {

                let getObject = {
                    Bucket: process.env.Bucket, 
                    Key: key
                }
                
                await new Promise( (resolveinside) => {
                    s3.getObject(getObject, (err, data) => {
                        if(err) {
                            res.status(400).json({ 'msg': 'error while geting files', err })
                        }

                        if (data.Body && data.Body.toString()) {                            
                            const csvJson = data.Body.toString()
                            CSVStringArray.push({ csvJson, key })
                            resolveinside(console.log('get files resolveinside'));
                        }
                    })
                })
            }
        }
    }

    
    // console.log('get files content method end');
    // console.log('*****************')
    // let emptym = []
    // let fbCampaigns = []
    // let taboolaAccounts = []

    //use try catch
    if (CSVStringArray) {
        for (let i = 0; i < CSVStringArray.length; i++) {
            const key = CSVStringArray[i].key
            const file = CSVStringArray[i].csvJson
            const jsonObj = await csv().fromString(file)
            // console.log('csv to json done')

            if (key.includes("fb")) {
                // console.log('fb file')
                const pushFbData = jsonObj.map( (expenseRow) => {
                    // fbCampaigns.push({ 
                    //     'campaign_id': expenseRow.campaign_id, 
                    //     'campaign_name': expenseRow.campaign_name
                    // })
                    // console.log(fbCampaigns)

                    // if(expenseRow.spend != 0) {
                        // console.log('inside fb map function')
                        return {
                            'account_id': expenseRow.account_id,
                            'account_name': expenseRow.account_name,
                            'campaign_id': expenseRow.campaign_id,
                            'campaign_name': expenseRow.campaign_name,
                            'spends': expenseRow.spend,
                            'clicks': expenseRow.clicks,
                            'reach': expenseRow.reach,
                            'impressions': expenseRow.impressions,
                            'cpc': expenseRow.cpc,
                            'cpp': expenseRow.cpp,
                            'cpm': expenseRow.cpm,
                            'ctr': expenseRow.ctr,
                            'date_start': expenseRow.date_start,
                        }
                    // }
                    
                })

                // console.log('after json to fb rows')
                // console.log(key)
                if(pushFbData) {
                     AutomateExpensefb.collection.insertMany(pushFbData, (err, docs) => {
                        if(err) {
                            // res.status(400).json({ 'msg': 'error while geting files', err })
                            console.log('error while pushing data in db - fb')
                            console.log(key)
                            console.log(err)
                        } else {
                            console.log('document submitted fb')
                            console.log(key)
                        }
                        
                    });
                }

                // await FBCampaign.addListener(fbCampaigns)

            }  else if (key.includes("taboola")) {
                // console.log('taboola file')
                const pushTaboolaData = jsonObj.filter( (expenseRow) => {
                    // taboolaAccounts.push({ 
                    //     'campaign_id': expenseRow.campaign_id
                    // })
                    if(expenseRow.spent != 0) {
                        // console.log('inside taboola map function')
                        return {
                            'campaign_id': expenseRow.campaign_id,
                            'spends': expenseRow.spent,
                            'clicks': expenseRow.clicks,
                            'impressions': expenseRow.impressions,
                            'cpa_actions': expenseRow.cpa_actions_num,
                            'cpc': expenseRow.cpc,
                            'cpa': expenseRow.cpa,
                            'cpm': expenseRow.cpm,
                            'ctr': expenseRow.ctr,
                            'date_start': expenseRow.date,
                        }
                    } else {
                        return null
                    }
                    
                })

                // console.log('after json to taboola rows')
                // console.log(key)

                if(pushTaboolaData) {
                    // console.log(pushTaboolaData)
                    AutomateExpenseTaboola.collection.insertMany(pushTaboolaData, (err, docs) => {
                        if (err){ 
                            console.log('error while pushing data in db - taboola')
                            console.log(err)
                        } else {
                            console.log('document submitted taboola')
                            console.log(key)
                        }
                    })
                }

            }

        }

        // res.status(200).json({ 'msg': 'data inserted successfully need to add the key files'})
    }

    // console.log('hi3');
}

//Think how to map taboola accounts to account name
//how to show to clients -- need to think about the restriction

router.post('/getAutomateExpenses', async (req, res) => {
    // const { campaign_id, start_date, end_date, source } = req.body;
    // console.log("req.body");
    // console.log(req.body);
    
    const campaign = '23843825454290616'
    const start_date = '2020-06-10T00:00:00.000Z'
    const end_date = '2020-06-11T00:00:00.000Z'
    const source = 'facebook'

    let campaigns_new_array = []
    let checkDuplicate = ''
    let count = 0;
    if(source === 'facebook') {
        AutomateExpensefb.find({
            "date_start": { 
                '$gte': start_date,
                '$lte': end_date
            },
            // "campaign_id": campaign
        }, (err, result) => {
            if(err) res.status(400).json({ 'err': err })
            if (result) {
                const length = result.length
                for (var i = 0; i < length; i++) {
                    count++
                    console.log(count)
                    let array1 = {
                        'campaign_id' : result[i].campaign_id,
                        'date_start' : result[i].date_start
                    }

                    if(campaigns_new_array) {
                        checkDuplicate = campaigns_new_array.find( (elem) => {
                            return elem
                        })
                    }
                    console.log(checkDuplicate)

                    // checkDuplicate = campaigns_new_array.find()
                    campaigns_new_array.push(array1)
                    if(count == 5) {
                        console.log(campaigns_new_array)
                        return campaigns_new_array;
                    }
                }
                // console.log(result)
                res.status(200).json(campaigns_new_array)
            }
        })
    } else if(source == 'taboola') {
        AutomateExpenseTaboola.find({
            "date_start": { 
                '$gte': new Date(start_date), 
                '$lte': new Date(end_date)
            },
            campaign_id: campaign_id
        }, (err, result) => {
            if(err) res.status(400).json({ 'err': err })
            res.status(200).json({ 'spendings': result })
        })
    }
})

//Need to write CRONJOB for this
const deleteObjects = async (req, res) => {
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
}


cron.schedule("* 7 * * *", function () {
    // console.log("Running Cron Job inside");
    automateExpenseUpdateInDB()
})
cron.schedule("* 8 * * *", function () {
    console.log("Running Cron Job inside");
    automateExpenseUpdateInDB()
})


module.exports = router