const express = require("express")
const path = require("path")
const { ObjectId } = require('mongodb');

// const Expense = require("../models/Expense")
const FacebookCampaign = require("../models/FacebookCampaign")
const TaboolaCampaign = require("../models/TaboolaCampaign")
const Campaign = require("../models/Campaign")
const router = express.Router()

let middleware = require('../config/middleware');

// Get facebook campaign
router.get('/facebook', middleware.checkToken, (req, res) => {
    FacebookCampaign.find({}, (err, result) => {
        res.json({ campaign: result })
    })
})


// Get taboola campaign
router.get('/taboola', middleware.checkToken, (req, res) => {
    TaboolaCampaign.find({}, (err, result) => {
        res.json({ campaign: result })
    })
})

// Add facebook campaign
router.post('/addFacebook', (req, res) => {

    const fbCampaign = new FacebookCampaign({
        campaign_name: req.body.campaign_name,
        campaign_id: req.body.campaign_id
    })
    const fbcamp  = fbCampaign.save()

    res.json({ fbcamp })
})



// Get facebook campaign
router.post('/addTaboola', (req, res) => {

    const taboolaCampaign = new TaboolaCampaign({
        campaign_name: req.body.campaign_name,
        campaign_id: req.body.campaign_id
    })
    const tbcamp  = taboolaCampaign.save()

    res.json({ tbcamp })
})


// Add campaign Name 
router.post('/addCampaignName', (req, res) => {

    const campaignName = new Campaign({
        name: req.body.campaign_name,
        campaignStartDate: req.body.campaign_start_date,
        plannedLeads: req.body.planned_leads,
        project: req.body.project_id,
        totalBudget: req.body.total_budget
    })
    const campName  = campaignName.save()

    res.json({ campName })
})

// get campaign Name list
router.post('/getCampaignNames', (req, res) => {

    const project_id = req.body.project_id
    
    let filter = { project: ObjectId(project_id)}
    Campaign.find(filter, (err, result) => {
        
        res.json({ campaigns: result })

    })

})

module.exports = router