const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserProjectsSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required:true 
    },
    project: { 
        type: Schema.Types.ObjectId, 
        ref: 'Project',
        required:true 
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const UserProjects = mongoose.model('UserProjects', UserProjectsSchema)

module.exports = UserProjects