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
    date: {
        type: Date,
        default: Date.now
    },
});

const User = mongoose.model('User', UserSchema)

module.exports = User