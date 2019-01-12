/**
 * End point admin for our server
 * 
 */

const express = require('express')
const app = express()
const query = require('../utils/method.express')
const { response } = require('../utils/helper')

app.route('/users')
    .get(query('get', 'user'), response)

app.route('/user/:_id')
    .post(query('addDevice', 'user'), response)
    .get(query('getOne', 'user'))
    .delete(query('delete', 'user'), response)
    .put(query('deleteDevice', 'user'), response)

module.exports = app