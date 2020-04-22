const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: Schema.Types.ObjectId, 
        ref: 'City',
        required:true 
    },
    company: { 
        type: Schema.Types.ObjectId, 
        ref: 'Company',
        required:true 
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const Project = mongoose.model('Project', ProjectSchema)

module.exports = Project