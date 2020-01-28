const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    _id:                { type: Number, required: true },

    username:           String,
    first_name:         String,
    user_name:          String,
    user_surname:       String,
    user_middlename:    String,
    user_birthday:      String,
    user_iin:           Number,
    
    by_whom:            Number,
    ref_url:            String,

    date:               { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', userSchema)