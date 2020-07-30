const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CampaignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    campaignStartDate: {
        type: String
    },
    plannedLeads: {
        type: Number
    },
    project: { 
        type: Schema.Types.ObjectId, 
        ref: 'Project'
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const Campaign = mongoose.model('Campaign', CampaignSchema)

module.exports = Campaign