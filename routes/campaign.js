const express = require("express")
const path = require("path")

// const Expense = require("../models/Expense")
const FacebookCampaign = require("../models/FacebookCampaign")
const TaboolaCampaign = require("../models/TaboolaCampaign")
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

// Get facebook campaign
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

module.exports = router