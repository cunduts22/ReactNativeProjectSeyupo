require('dotenv').config()
const mongoose = require('mongoose')

const db_host = process.env.DB_HOST
const db_port = process.env.DB_PORT
const db_name = process.env.DB_NAME
const url = `${db_host}:${db_port}`

module.exports.initializeMongo = () => {
    mongoose.set('useCreateIndex', true)
    mongoose.connect(url, {
        useNewUrlParser: true,
        dbName: db_name
    })

    const db = mongoose.connection
    db.on('error', console.error.bind(console, "Error: failed to connect MongoDb"))
    db.once('open', () => {
        console.log('MongoDb run on port '+db_port)
    })
}