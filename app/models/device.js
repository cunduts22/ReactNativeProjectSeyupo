const mongoose = require('mongoose')
const Schema = mongoose.Schema
const deviceSchema = new Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    }
})

module.exports = mongoose.model('Device', deviceSchema)