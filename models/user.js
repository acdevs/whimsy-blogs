const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    alias:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
})

const User = mongoose.model('User', userSchema) //singular name of the collection

module.exports = User