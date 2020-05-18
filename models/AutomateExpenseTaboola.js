const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const AutomateExpenseSchemaTaboola = new mongoose.Schema({
    account_id: {
        type: Number,
        required: true
    },
    account_name: {
        type: String,
        required: true
    },
    campaign_id: {
        type: Number,
        required: true
    },
    campaign_name: {
        type: String,
        required: true
    },
    spends: {
        type: Number,
        required: true
    },
    ctr: {
        type: Number,
        required: true
    },
    cpc: {
        type: Number,
        required: true
    },
    cpp: {
        type: Number,
        required: true
    },
    cpm: {
        type: Number,
        required: true
    },
    clicks: {
        type: Number,
        required: true
    },
    reach: {
        type: Number,
        required: true
    },
    impressions: {
        type: Number,
        required: true
    },
    unique_clicks: {
        type: Number,
        required: true
    },
    date_start: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const AutomateExpenseTaboola = mongoose.model('AutomateExpenseTaboola', AutomateExpenseSchemaTaboola)

module.exports = AutomateExpenseTaboola