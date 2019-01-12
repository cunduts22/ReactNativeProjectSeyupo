/**
 * End point for our server
 * 
 */

const express = require('express')
const app = express()
const query = require('../utils/method.express')
const {response} = require('../utils/helper')

app.route('/sign-in')
    .post(query('login','user'))

app.route('/sign-up')
    .post(query('post','user'))

module.exports = app