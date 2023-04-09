const mongoose = require('mongoose');

const JudgeSchema = new mongoose.Schema
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
        exp_yrs: {
            type: Number,
            required: true
        },
   
        dob: {
            type: Date
        },
        age: {
            type: Number
        },
        
        ph_no: {
            type: Number,
            required: true
        }
        
        
    }
);


const Judge = mongoose.model('Judge', JudgeSchema);

module.exports = Judge;