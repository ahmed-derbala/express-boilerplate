const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const users_srvc = require('./users_srvc')





module.exports.getUsers = async (req, res) => {
    return users_srvc.getUsers()
        .then(users => {
            return res.status(200).json({ msg: 'users', data: users })
        })
        .catch(err => errorHandler({ err, res }))
}