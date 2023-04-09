const mongoose = require("mongoose");

const CaseDetailsSchema = new mongoose.Schema({
  total_hearings: {
    type: Number,
    required: true,
  },
  winning_lawyer: {
    type: String,
    required: true,
  },
  punishment_details: {
    type: String,
    required: true,
  },
  judge: {
    type: String,
  },
  case_id: {
    type: Object(),
    required: true,
  },
  lawyer_prosecutor: {
    type: String,
    required: true,
  },

  lawyer_defendent: {
    type: String,
    required: true,
  },

  isResolved: {
    type: Boolean,
    default: false,
  },
  h_date: {
    type: Date,
    default: Date.now,
  },

  case_type: {
    type: String,
  },
  case_name: {
    type: String,
    required: true,
  },

  court_case_no: {
    type: String,
  },



  case_descp: {
    type: String,
    required: true,
  },

  court_type: {
    type: String,
  },

});

const CaseDetails = mongoose.model("CaseDetails", CaseDetailsSchema);

module.exports = CaseDetails;
