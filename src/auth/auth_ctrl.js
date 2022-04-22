const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const Sessions = mongoose.model('Sessions');
const bcrypt = require('bcrypt');
const { errorHandler } = require('../../utils/error');
const jwt = require('jsonwebtoken');


module.exports.signup = async (req, res) => {
    const salt = bcrypt.genSaltSync(prefs.saltRounds)
    req.body.password = bcrypt.hashSync(req.body.password, salt)
    return Users.create(req.body)
        .then(createdUser => {
            createdUser=createdUser.toJSON()
            delete createdUser.password
            if (req.body.username == null) {
                return Users.updateOne({ _id: createdUser._id }, { username: createdUser._id })
                    .then(updatedUser => {
                        createdUser.username = createdUser._id
                        return res.status(201).json({ msg: 'user created', data: createdUser })
                    })
                    .catch(err => errorHandler({ err, res }))
            }
            return res.status(201).json({ msg: 'user created', data: createdUser })
        })
        .catch(err => errorHandler({ err, res }))
}

module.exports.signin = async (req, res) => {
    return Users.findOne({ email: req.body.email }).lean().select('_id +password')
        .then(user => {
            if (user == null) {
                return res.status(404).json({ msg: 'user not found', data: null })
            }
            //user found, check password
            return bcrypt.compare(req.body.password, user.password, function (err, result) {
                if (err) {
                    return errorHandler({ err, res })
                }
                delete user.password//we dont need password anymore
                if (result == false) {
                    return res.status(409).json({ msg: 'password incorrect', data: null })
                }
                return jwt.sign({ user:user._id, ip: req.ip, userAgent: req.headers['user-agent'] }, prefs.jwt.private_key, { expiresIn: '30d' }, (err, token) => {
                    if (err) {
                        return errorHandler({ err, res })
                    }
                    return Sessions.create({ token, userId: user._id, headers: req.headers })
                        .then(session => {
                            return res.status(200).json({ msg: 'success', data: { user, token } })
                        })
                        .catch(err => errorHandler({ err, res }))
                })
            });
        })
        .catch(err => errorHandler({ err, res }))
}

module.exports.signout = async (req, res) => {
    return Sessions.deleteOne({ token: req.headers.token })
        .then(deletedSession => {
            return res.status(200).json({ msg: 'singedout', data: deletedSession })
        })
        .catch(err => errorHandler({ err, res }))
}