const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema
(
    {
        gender: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        adhaar_id: {
            type: Number,
            required:true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        
    }
);


const User = mongoose.model('User', UserSchema);

module.exports = User;