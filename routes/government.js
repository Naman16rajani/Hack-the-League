const {ObjectId} = require('mongodb');
const express = require('express');
const router = express.Router();
const GovEmpDetails = require('../models/GovernmentEmplyoe');
//include auth fns
const {notIfLoggedIn} = require('../config/auth');
const {ensureAuthenticated} = require('../config/auth');
const passport = require("passport");
const bcrypt = require("bcryptjs");

router.get("/",notIfLoggedIn,(req, res)=>{
    res.render("gov_emp_home_page")
})

router.get("/register",notIfLoggedIn,(req, res)=>{
    res.render("gov_emp_register")
})

router.get("/login",notIfLoggedIn,(req, res)=>{
    res.render("gov_emp_login")
})
router.get("/dashboard",((req, res) => {
    res.render("gov_emp_dashboard")
}))
router.post("/register",notIfLoggedIn,(req, res)=>{
    console.log("register post gov_emp")
    console.log(req.body)
    const { name, email, password, password2,gender,adhaar_id} = req.body;

    let errors = [];
    //check required fields
    if(  !name || !email || !password || !password2)
        errors.push({message: 'Please fill in all the fields...'});
    //check whether passwords match
    if(password !== password2)
        errors.push({message: 'Passwords do not match...'});
    //check password length (>6)
    // if(password.length < 6)
    //     errors.push({message: 'Password should be atleast 6 characters...'});
    //
    if(errors.length > 0)
        res.render
        (
            'gov_emp_register',
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
        GovEmpDetails.findOne
        (
            {
                email: email
            }
        ).then
        (
            (user) =>
            {
                if(user)
                {
                    console.log("gov emp already exits")
                    //user already exists
                    errors.push({message: 'e-mail is already registered...'});
                    res.render
                    (
                        'gov_emp_register',
                        {
                            errors,
                            name,
                            email,
                            password,
                            password2
                        }
                    );
                }
                else
                {

                    // TODO: do adhaar card verification
                    const new_gov_emp = new GovEmpDetails
                    (
                        {
                            gender:gender,
                            name:name,
                            email:email,
                            password:password,
                            adhaar_id:adhaar_id,
                            exp_yrs:req.body.exp_yrs,
                            dob:req.body.dob,
                            age:req.body.age,
                            gov_id:req.body.Governmentid,
                            ph_no:req.body.ph_no
                        }
                    );
                    console.log("hashing password")

                    //hash password
                    bcrypt.genSalt
                    (
                        10,
                        (err, salt) => bcrypt.hash
                        (
                            new_gov_emp.password,
                            salt,
                            (err, hash) =>
                            {
                                if(err)
                                    throw err;

                                //set plain text pass to hashed pass
                                new_gov_emp.password = hash;
                                //save user
                                console.log("new gov emp save")
                                new_gov_emp.save().then
                                (
                                    (user) =>
                                    {
                                        req.flash('success_msg', 'You are now registered and can log in...'); //created flash msg
                                        res.redirect('/govEmp/login');
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
router.post("/login",notIfLoggedIn,(req, res,next)=>{

    let password = req.body.password;
    let email = req.body.email;

    console.log("password " + password)
    console.log("email " + email)

    GovEmpDetails.findOne
    (
        {
            email: email
        }
    ).then
    (
        (user) =>
        {
            console.log("passport: matching password")

            if(!user) {
                res.send("That e-mail is not registered...")
                return

            }
                // return done(null, false, {message: 'That e-mail is not registered...'});
            console.log("passport: match password")
            //else, match password
            bcrypt.compare
            (
                password,
                user.password,
                (err, isMatch) =>
                {
                    if(err)
                        throw err;

                    if (isMatch)
                        res.redirect("/govEmp/dashboard")
                    // return done(null, user);
                    else
                        res.redirect("/govEmp/login")
                }
            );
        }
    ).catch
    (
        (err) => console.log(err)
    );





})

module.exports = router;