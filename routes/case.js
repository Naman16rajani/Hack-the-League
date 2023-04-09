// /case/add
//
//
const {ObjectId} = require('mongodb');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
//include auth fns
const {notIfLoggedIn} = require('../config/auth');
const {ensureAuthenticated} = require('../config/auth');
const passport = require("passport");
const bcrypt = require("bcryptjs");
const CaseDetails = require("../models/CaseDetails");


router.post("/add",(req, res)=>{
    console.log(req.body)

    const newCase=new CaseDetails(
        {
            total_hearings: req.body.totalHearings,
            winning_lawyer: req.body.winningLawyer,
            punishment_details: req.body.punishmentDetails,
            judge: req.body.judge,
            case_id: req.body.caseId,
            lawyer_prosecutor: req.body.lawyerProsecutor,

            lawyer_defendent:req.body.lawyerDefendant ,

            isResolved: req.body.caseResolved,
            h_date: req.body.hearingDate,

            case_type: req.body.caseType,
            case_name: req.body.case_name,

            court_case_no:req.body.court_case_no,

            case_descp: req.body.caseDescription,

            court_type: req.body.courtType,
        }
    );
        newCase.save().then
        (
            (user) =>
            {
                    req.flash('success_msg', ''); //created flash msg
                    res.redirect('/govEmp/dashboard');
            }
        ).catch
        (
            (err) => console.log(err)
        );
})

module.exports = router


