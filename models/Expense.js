const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ExpenseSchema = new mongoose.Schema({
    project: {
        type: Schema.Types.ObjectId, 
        ref: 'Project',
        required:true 
    },
    campaignType: {
        type: String,
        required: true
    },
    actualLeads: {
        type: Number,
        required: true
    },
    allocation: {
        type: Number,
        default: 0
    },
    plannedLeads: {
        type: Number,
        required: true
    },
    totalBudget: {
        type: Number,
        required: true
    },
    totalSpending: {
        type: Number,
        required: true
    },
    cpl: {
        type: Number,
        required: true
    },
    clicks: {
        type: Number,
        required: true
    },
    impressions: {
        type: Number,
        required: true
    },
    campaign: {
        type: Schema.Types.ObjectId, 
        ref: 'Campaign', 
        required: false
    },
    spendingDate: {
        type: String,
        required: true
    },
    campaignStartDate: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    updatedBy: {
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const Expense = mongoose.model('Expense', ExpenseSchema)

module.exports = Expense