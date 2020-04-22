const mongoose = require('mongoose')

const CitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const City = mongoose.model('City', CitySchema)

module.exports = City