require('dotenv').config()
const http = require('http')
const app = require('./app')
const server = http.createServer(app)
const port = process.env.PORT
server.listen(port).on('listening', () => console.log(`server running on port ${port}`))
const io = require('socket.io').listen(server)
require('./app/socket').initializeSocket(io)

module.exports = io