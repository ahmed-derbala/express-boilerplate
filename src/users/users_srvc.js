const mongoose = require('mongoose');
const Users = mongoose.model('Users');





module.exports.getUsers = async (params) => {
    return Users.find().lean()
    .then(users=>{
        return users 
    })
    .catch(err => errorHandler({ err, res }))
}