const {ObjectId} = require('mongodb');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
//include auth fns
const {notIfLoggedIn} = require('../config/auth');
const {ensureAuthenticated} = require('../config/auth');
const passport = require("passport");
const bcrypt = require("bcryptjs");
const LawyerDetails = require("../models/LawyerDetails");
const GovEmpDetails = require("../models/GovernmentEmplyoe");
const CaseDetails = require('../models/CaseDetails');

router.get("/", (req, res) => {
    res.render("lawyer_home_page")
})
router.get("/register", (req, res) => {
    res.render("lawyer_register")
})
router.get("/login", (req, res) => {
    res.render("lawyer_login")
})

router.post("/register", (req, res) => {
    console.log("register post ")
    console.log(req.body)
    const {name, email, password, password2, gender, adhaar_id} = req.body;

    let errors = [];
    //check required fields
    if (!name || !email || !password || !password2)
        errors.push({message: 'Please fill in all the fields...'});
    //check whether passwords match
    if (password !== password2)
        errors.push({message: 'Passwords do not match...'});
    //check password length (>6)
    // if(password.length < 6)
    //     errors.push({message: 'Password should be atleast 6 characters...'});
    //
    if (errors.length > 0)
        res.render
        (
            'lawyer_register',
            {
                errors,
                name,
                email,
                password,
                password2
            }
        );
    else //validation passed
    {
        //check if user already exists
        LawyerDetails.findOne
        (
            {
                email: email
            }
        ).then
        (
            (user) => {
                if (user) {
                    console.log("user already exits")
                    //user already exists
                    errors.push({message: 'e-mail is already registered...'});
                    res.render
                    (
                        'lawyer_register',
                        {
                            errors,
                            name,
                            email,
                            password,
                            password2
                        }
                    );
                } else {

                    // TODO: do adhaar card verification
                    const new_lawyer = new LawyerDetails
                    (
                        {
                            gender: gender,
                            lawyer_name: name,
                            email: email,
                            bar_council_id: req.body.BarCouncilId,
                            exp_yrs: req.body.exp_yrs,
                            dob: req.body.dob,
                            age: req.body.age,
                            ph_no: req.body.ph_no,
                            password: password,
                            adhaar_id: adhaar_id
                        }
                    );
                    console.log("hashing password")

                    //hash password
                    bcrypt.genSalt
                    (
                        10,
                        (err, salt) => bcrypt.hash
                        (
                            new_lawyer.password,
                            salt,
                            (err, hash) => {
                                if (err)
                                    throw err;

                                //set plain text pass to hashed pass
                                new_lawyer.password = hash;
                                //save user
                                console.log("new user save")
                                new_lawyer.save().then
                                (
                                    (user) => {
                                        req.flash('success_msg', 'You are now registered and can log in...'); //created flash msg
                                        res.redirect('/lawyer/login');
                                    }
                                ).catch
                                (
                                    (err) => console.log(err)
                                );
                            }
                        )
                    );
                }
            }
        );
    }

})
router.post("/login", (req, res, next) => {

    // passport.authenticate
    // (
    //     'local',
    //     {
    //         successRedirect: '/lawyer/dashboard',
    //         failureRedirect: '/lawyer/login',
    //         failureFlash: true
    //     }
    // )(req, res, next);
    let password = req.body.password;
    let email = req.body.email;
    console.log("password " + password)
    console.log("email " + email)

    LawyerDetails.findOne
    (
        {
            email: email
        }
    ).then
    (
        (user) => {
            console.log("passport: matching password")

            if (!user) //if no match
            {
                res.send("That e-mail is not registered...");
                return
            }
            // return done(null, false, {message: 'That e-mail is not registered...'});
            console.log("passport: match password")
            //else, match password
            bcrypt.compare
            (
                password,
                user.password,
                (err, isMatch) => {
                    if (err)
                        throw err;
                    if (isMatch)
                        res.redirect("/lawyer/dashboard/" + user.lawyer_name)
                    // return done(null, user);
                    else
                        res.redirect("/lawyer/login")
                    // if(isMatch)
                    //     return done(null, user);
                    // else
                    //     return done(null, false, {message: 'Password incorrect...'});
                }
            );
        }
    ).catch
    (
        (err) => console.log(err)
    );


})

//dashboard
router.get
(
    '/dashboard/:name',
    async (req, res) => {
        console.log(req.params)
        try {
            const lawyerName = req.params.name; // Assuming the currently logged in user is a lawyer with a unique ID
            const cases = await CaseDetails.find({$or: [{lawyer_prosecutor: lawyerName}, {lawyer_defendent: lawyerName}]}); // Find all the cases handled by the lawyer

            const totalCases = cases.length; // Total cases handled by the lawyer
            const totalWins = cases.filter(c => c.winning_lawyer === lawyerName).length; // Total cases won by the lawyer
            const totalLosses = cases.filter(c => c.winning_lawyer !== lawyerName && c.isResolved).length; // Total cases lost by the lawyer

            let lawyer = {
                'lawyer_name': lawyerName
            }

            res.render('lawyer_dashboard', {
                lawyer,
                totalCases,
                totalWins,
                totalLosses,
                cases
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }

    }
);

//profile
router.get
(
    '/profile',
    ensureAuthenticated,
    (req, res) => {
        res.render('lawyer_profile', {f_name: req.user.fname});
    }
);
router.post
(
    '/profile',
    ensureAuthenticated,
    async (req, res) => {
        //comma separated preferred case types to arr
        const pref_case_types = req.body.pref_case_types;
        const pref_case_types_arr = pref_case_types.split(",");
        pref_case_types_arr.forEach((case_type) => case_type = case_type.trim());

        const new_lawyer_details = new LawyerDetails
        (
            {
                lawyer_id: req.user._id,
                bar_council_id: req.body.bar_id,
                company_name: req.body.company_name,
                pref_case_types: pref_case_types_arr,
                exp_yrs: req.body.exp_yrs,
                experience: req.body.exp,
                fees: req.body.fees,
                fee_descp: req.body.fee_descp,
                dob: req.body.dob,
                age: req.body.age,
                ph_no: req.body.ph_no
            }
        );

        await new_lawyer_details.save().then
        (
            async (new_lawyer_obj) => {
                await User.updateOne
                (
                    {
                        _id: req.user._id
                    },
                    {
                        $set: {
                            is_profile_complete: "Y"
                        }
                    }
                ).then
                (
                    res.redirect('/lawyer/dashboard')
                ).catch
                (
                    (err) => console.log(err)
                );
            }
        ).catch
        (
            (err) => console.log(err)
        );
    }
);

//display profile
router.get
(
    '/display_lawyer_profile/:lawyer_id',
    ensureAuthenticated,
    async (req, res) => {
        await LawyerDetails.find
        (
            {
                lawyer_id: ObjectId(req.params.lawyer_id)
            }
        ).then
        (
            async (lawyer_details) => {
                await User.find
                (
                    {
                        _id: ObjectId(req.params.lawyer_id)
                    }
                ).then
                (
                    (lawyer_bio) => {
                        const {fname, mname, lname, email} = lawyer_bio[0];
                        const {
                            company_name,
                            pref_case_types,
                            exp_yrs,
                            experience,
                            fees,
                            fee_descp,
                            dob,
                            age,
                            ph_no
                        } = lawyer_details[0];

                        res.render('display_lawyer_profile', {
                            fname,
                            mname,
                            lname,
                            email,
                            company_name,
                            pref_case_types,
                            exp_yrs,
                            experience,
                            fees,
                            fee_descp,
                            dob,
                            age,
                            ph_no
                        });
                    }
                ).catch
                (
                    (err) => console.log(err)
                );
            }
        ).catch
        (
            (err) => console.log(err)
        );
    }
);


module.exports = router;