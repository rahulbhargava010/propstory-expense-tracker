const mongoose = require('mongoose')

const FBCampaignSchema = new mongoose.Schema({
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

const FBCampaign = mongoose.model('FBCampaign', FBCampaignSchema)

module.exports = FBCampaign