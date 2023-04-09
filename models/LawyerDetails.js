const mongoose = require('mongoose');

const LawyerDetailsSchema = new mongoose.Schema
(
    {

        lawyer_name: {
            type: String,
            required: true
        },
        adhaar_id: {
            type: Number,
            required: true
        },
        email:{
          type:String,
          required:true
        },
        bar_council_id: {
            type: String,
            required: true
        },
        password:{
            type:String,
            required:true
        },
        exp_yrs: {
            type: Number,
            required: true
        },
        gender:{
            type: String,
            required:true
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


const LawyerDetails = mongoose.model('LawyerDetails', LawyerDetailsSchema);

module.exports = LawyerDetails;