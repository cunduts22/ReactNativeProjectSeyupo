const mongoose = require('mongoose')
const Device = require('./device')
const Schema = mongoose.Schema
const userSchema = new Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: [true, 'name is required']
    },
    email: {
        type: mongoose.Schema.Types.String,
        unique: [true, 'Email is already exist'],
        validate: {
            validator: function(v) {
                var valid = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return valid.test(v)
            },
            message: '{VALUE} is not valid email address'
        },
        required: [true, 'Email is required']
    },
    username: {
        type: mongoose.Schema.Types.String,
        unique: [true, 'username is already exist'],
        validate: {
            validator: function(v) {
                var valid = /^[a-zA-Z0-9.\-_$@*!]{3,30}$/;
                return valid.test(v);
            },
            message: '{VALUE} is not valid email address'
        },
        required: true
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    listDevice: {
        type:[Device.schema]
    }
})

module.exports = mongoose.model('User', userSchema)