require('dotenv').config()
const jwt = require('jsonwebtoken')

const response = async (req, res) => {
    try {
        if(req.status === undefined)
            res.status(404).json({data: 'data not found'}).end()
        else
            res.status(req.status).json(req.userData).end()
    } catch (error) {
        console.log(error)
    }
}

const checkAuthentication = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        jwt.verify(token, process.env.JWT_KEY)
        next()
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
}

module.exports = {
    response,
    checkAuthentication
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzJmNGQ3MmRiZmM1Mzc1ZDZmYzQwYmUiLCJ1c2VybmFtZSI6InRlc3RlcjQ0MSIsImlhdCI6MTU0NjYwNTQwOSwiZXhwIjoxNTQ2NjE3ODA5fQ.2DotBUdZ7EnpkBr0c2-rSbugoNKvoexVURld4ZC5nGY