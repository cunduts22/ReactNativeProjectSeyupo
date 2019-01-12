/**
 * utils that help to use mongodb query
 * GET, DELETE, PUT, POST, PATCH
 */

const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

module.exports = function(method, model) {
    const handleRequest = function(req, res, next) {
        const types = method.toLowerCase()
        return checkType(types, req, res, next)
    }

    const checkType = function(types, req, res, next) {
        try {
            for(let obj in job) {
                if (obj === types) {
                    job[obj](req, res, next)
                    break
                }
            }
        } catch (error) {
            throw error
        }
    }

    const get = function (req, res, next) {
        try {
            const Schema = require(`../models/${model}`)
            Schema.find().exec().then(result => {
                req.userData = result
                req.status = 200
                req.type = model
                next()
            }).catch(err => {
                res.status(500).json({
                    message: err,
                    error: 'data not found'
                })
            })
        } catch (error) {
            console.log(`please make a sure, that model's name is exist`)
            console.log(error)
            res.status(500).json({
                error: 'internal server error'
            })
        }
    }

    const post = function (req, res, next) { // req, res, next from express method Route('<endpoint>').post
        try { // use try and catch
            const Schema = require(`../models/${model}`) // our mongodb schema
            const ob = req.body
            new Schema(ob)
                .save()
                .then((result) => { // use asyncronus
                    res.status(200).json({ // set status 200 or ok and res to json
                        create: result
                    }).end()
                })
                .catch((err) => { // catch the error
                    // console.log(err)
                    if (err.code === 11000) { // error code 11000 is a duplicate key
                        const { message } = err // err.message
                        const error = message.split(" ") // return string to array
                        console.log(error)
                        const data = error[error.length - 2].split('"')[1] // get our duplicate key
                        res.status(500).json({ // set status to 500 or internal server error
                            error: data + " is already exist", // response the data already exisit
                        }).end()
                    } else {
                        res.status(500).json({ error: err }).end()// set status to 500 and response the error
                    }
                })
        } catch (error) { // this will return when out schema is not found
            console.log(error)
            res.status(500).json({
                Error: 'internal server error',
                err: error
            })
        }
    }

    const addDevice = function (req, res, next) {
        try {
            const User = require('../models/user')
            
            if(req.body.name === undefined || req.body.name === "" || req.body.name === null) {
                res.status(500).json({
                    error: 'name is required'
                }).end()
            } else {
                User.update({_id: mongoose.Types.ObjectId(req.params._id)}, { $push: {
                    listDevice: {"name": req.body.name}
                }}, {new: true})
                  .then(result => {
                    req.userData = result;
                    req.status = 200;
                    next();
                  })
                  .catch(err => {
                    res
                      .status(500)
                      .json(err)
                      .end();
                  });
            }

        } catch (error) {
            console.log(error)
            res.status(500).end()
        }
    }

    const erase = function (req, res, next) {
        try {
            const Schema = require(`../models/${model}`)
            Schema.deleteOne(req.params).exec().then(result => {
                req.userData = result
                req.status = 200
                next()
            }).catch(err => {
                res.status(500).json({
                    error: err
                }).end()
            })
        } catch (error) {
            console.log(error)
            res.status(500).end()
        }
    }
    

    const getOne = function (req, res) {
        try {
            const Schema = require(`../models/${model}`)
            console.log('test')
            Schema.find(req.params).exec()
            .then(result => {
                if(result.length !== 0) {
                    res.status(200).json(result).end()
                } else {
                    res.status(404).json({
                        message: 'No entries found'
                    })
                }
            })
        } catch (error) {
            console.log(error)
            res.status(500).end()
        }
    }

    const deleteDevice = function(req, res, next) {
        const User = require(`../models/user`)
        User.update(req.params, {
            $pull: {
                listDevice: {
                    _id: req.query._id
                }
            }
        }).then(result => {
            req.userData = result
            req.status = 200
        }).catch(err => {
            console.log(err)
            res.status(500).json(err).end()
        })
    }

    const login = async function (req, res, next) {
        try {
            const User = require('../models/user')
            const {password, username} = req.body

            const user = await User.find({username})
            if(user.length < 1) {
                res.status(401).json({message: 'user doesn\'t exist'}).end()
            } else {
                if(user[0].password === password) {
                    const token = jwt.sign(
                      {
                        _id: user[0]._id,
                        username: user[0].username
                      },
                      process.env.JWT_KEY,
                      {
                        expiresIn: 12400
                      }
                    );
                    // req.status = 200
                    const mres = {
                        message: 'you\'ve authenticated',
                        token,
                        _id: user[0]._id
                    }
                    res.status(201).json(mres).end()
                } else {
                    res.status(401).json({ message: 'failed to authenticated' }).end()
                }
                // next()
            }

        } catch (error) {
            console.log(error)
        }
    }
    const job = {
        get,
        post,
        login,
        delete: erase,
        getone: getOne,
        adddevice: addDevice,
        deletedevice: deleteDevice
    }

    return handleRequest
}