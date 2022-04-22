const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const uniqueValidator = require('mongoose-unique-validator');


const schema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    middlename: {
        type: String,
        required: false,
        select: false
    },
    lastname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    birthdate: {
        type: Date,
        required: false,
    },
    phones: {
        type: [
            {
                full_number: { type: String, required: true },
                country_code: { type: String, required: true },
                number: { type: String, required: true }
            }//phone[0] is the primary phone
        ],
        select: false
    },
    role: {
        type: Object,
        enum: prefs.users.roles,
        default: prefs.users.roles[0]
    },
    type: {
        type: Object,
        enum: prefs.users.types,
        default: prefs.users.types[0]
    },
    isActive:{
        type:Boolean,
        default:true
    }


},
    { timestamps: true });

schema.plugin(mongoosePaginate);
schema.plugin(uniqueValidator);

mongoose.model('Users', schema);

