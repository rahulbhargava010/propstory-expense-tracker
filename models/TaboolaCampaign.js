const mongoose = require('mongoose')

const TaboolaCampaignSchema = new mongoose.Schema({
    campaign_id: {
        type: String,
        required: true
    },
    campaign_name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const TaboolaCampaign = mongoose.model('TaboolaCampaign', TaboolaCampaignSchema)

module.exports = TaboolaCampaign