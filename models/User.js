const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    company: { 
        type: Schema.Types.ObjectId, 
        ref: 'Company',
        required: true 
    },
    enable: {
        type: Boolean,
        default: false
    },
    role:{
        type: String,
        default: 'TEAM_MEMBER'
    },
    token: {
        type: String,
        default: ''
    },
    confirmation: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const User = mongoose.model('User', UserSchema)

module.exports = User