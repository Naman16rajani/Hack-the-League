const mongoose = require('mongoose');

const GovEmpDetailsSchema = new mongoose.Schema
(
    {

        name: {
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
        gov_id: {
            type: String,
            required: true
        },
        password:{
            type:String,
            required:true
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


const GovEmpDetails = mongoose.model('GovEmpDetails', GovEmpDetailsSchema);

module.exports = GovEmpDetails;