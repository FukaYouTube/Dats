const mongoose = require('mongoose')

// Database model schema
let adminSchema = new mongoose.Schema({
    _id:            { type: Number, required: true },

    username:       String,
    first_name:     String,

    date:           { type: Date, default: Date.now }
})

// Export models
module.exports = mongoose.model('Admin', adminSchema)