const bcrypt = require('bcryptjs');
const passport = require('passport');
const express = require('express');
const router = express.Router();

//include auth fns
const {notIfLoggedIn} = require('../config/auth');
const {ensureAuthenticated} = require('../config/auth');

//include model
const User = require('../models/User')

//home page
router.get
(
    '/',
    notIfLoggedIn,
    (req, res) =>
    {
        res.render('home');
    }
);

//log in handle
router.get
(
    '/login',
    notIfLoggedIn,
    (req, res) =>
    {
        res.render('login');
    }
);
router.post
(
    '/login',
    notIfLoggedIn,
    (req, res, next) =>
    {
        if(req.body.personType === 'c') //client
        {
            passport.authenticate
            (
                'local',
                {
                    successRedirect: '/client/dashboard',
                    failureRedirect: '/login',
                    failureFlash: true
                }
            )(req, res, next);
        }
        else //lawyer
        {
            passport.authenticate
            (
                'local',
                {
                    successRedirect: '/lawyer/dashboard',
                    failureRedirect: '/login',
                    failureFlash: true
                }
            )(req, res, next);
        }
    }
);

//log out handle
router.get
(
    '/logout',
    ensureAuthenticated,
    (req, res) =>
    {
        req.logOut();
        req.flash('success_msg', 'You are logged out...');
        res.redirect('/login');
    }
)

//register handle
router.get
(
    '/register',
    notIfLoggedIn,
    (req, res) =>
    {
        console.log("register view")
        res.render('register');
    }
);
router.post
(
    '/register',
    notIfLoggedIn,
    (req, res) =>
    {
        console.log("register post ")
        console.log(req.body)
        const { fname, mname, lname, email, password, password2,gender,adhaar_id} = req.body;

        let errors = [];
        //check required fields
        if( !fname || !lname || !email || !password || !password2)
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
                'user_register',
                {
                    errors,
                    fname,
                    mname,
                    lname,
                    email,
                    password,
                    password2
                }
            );
        else //validation passed
        {
            //check if user already exists
            User.findOne
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
                        console.log("user already exits")
                        //user already exists
                        errors.push({message: 'e-mail is already registered...'});
                        res.render
                        (
                            'user_register',
                            {
                                errors,
                                fname,
                                mname,
                                lname,
                                email,
                                password,
                                password2
                            }
                        );
                    }
                    else
                    {

                        // TODO: do adhaar card verification
                        const new_user = new User
                        (
                            {
                                gender:gender,
                                name:fname+" "+mname+" "+lname,
                                email:email,
                                password:password,
                                adhaar_id:adhaar_id
                            }
                        );
                        console.log("hashing password")

                        //hash password
                        bcrypt.genSalt
                        (
                            10, 
                            (err, salt) => bcrypt.hash
                            (
                                new_user.password, 
                                salt, 
                                (err, hash) =>
                                {
                                    if(err)
                                        throw err;

                                    //set plain text pass to hashed pass
                                    new_user.password = hash;
                                    //save user
                                    console.log("new user save")
                                    new_user.save().then
                                    (
                                        (user) =>
                                        {
                                            req.flash('success_msg', 'You are now registered and can log in...'); //created flash msg
                                            res.redirect('/user/login');
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
    }
);


module.exports = router;