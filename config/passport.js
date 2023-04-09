//creating local strategy
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//load User model
const User = require('../models/User');
const LawyerDetails = require('../models/LawyerDetails');
const Judge=require('../models/JudgeDetails');
const GovEmpDetails=require('../models/GovernmentEmplyoe');


let userStrategy=(passport) =>
{
    passport.use
    (
        new LocalStrategy
        (
            {usernameField: 'email',},
            (email, password, done) => //theses are user passed in email and pass
            {
                //match user
                console.log("password " + password)
                console.log("email " + email)

                User.findOne
                (
                    {
                        email: email
                    }
                ).then
                (
                    (user) =>
                    {
                        console.log("passport: matching password")

                        if(!user) //if no match
                            return done(null, false, {message: 'That e-mail is not registered...'});
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

                                if(isMatch)
                                    return done(null, user);
                                else
                                    return done(null, false, {message: 'Password incorrect...'});
                            }
                        );
                    }
                ).catch
                (
                    (err) => console.log(err)
                );
            }
        )
    );

    //methods to serialize and de-serialize user
    passport.serializeUser
    (
        (user, done) =>
        {
            done(null, user.id);
        }
    );
      
    passport.deserializeUser
    (
        (id, done) =>
        {
            User.findById
            (
                id, 
                (err, user) =>
                {
                    done(err, user);
                }
            );
        }
    );
}

let judgeStrategy=(passport) =>
{
    passport.use
    (
        new LocalStrategy
        (
            {usernameField: 'email',},
            (email, password,personType, done) => //theses are user passed in email and pass
            {
                //match user
                console.log("person type "+ personType)
                console.log("password " + password)
                console.log("email " + email)

                Judge.findOne
                (
                    {
                        email: email
                    }
                ).then
                (
                    (user) =>
                    {
                        console.log("passport: matching password")

                        if(!user) //if no match
                            return done(null, false, {message: 'That e-mail is not registered...'});
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

                                if(isMatch)
                                    return done(null, user);
                                else
                                    return done(null, false, {message: 'Password incorrect...'});
                            }
                        );
                    }
                ).catch
                (
                    (err) => console.log(err)
                );
            }
        )
    );

    //methods to serialize and de-serialize user
    passport.serializeUser
    (
        (user, done) =>
        {
            done(null, user.id);
        }
    );

    passport.deserializeUser
    (
        (id, done) =>
        {
            Judge.findById
            (
                id,
                (err, user) =>
                {
                    done(err, user);
                }
            );
        }
    );
}

let lawyerStrategy=(passport) =>
{
    passport.use
    (
        new LocalStrategy
        (
            {usernameField: 'email',},
            (email, password,personType, done) => //theses are user passed in email and pass
            {
                //match user
                console.log("person type "+ personType)
                console.log("password " + password)
                console.log("email " + email)

                LawyerDetails.findOne
                (
                    {
                        email: email
                    }
                ).then
                (
                    (user) =>
                    {
                        console.log("passport: matching password")

                        if(!user) //if no match
                            return done(null, false, {message: 'That e-mail is not registered...'});
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

                                if(isMatch)
                                    return done(null, user);
                                else
                                    return done(null, false, {message: 'Password incorrect...'});
                            }
                        );
                    }
                ).catch
                (
                    (err) => console.log(err)
                );
            }
        )
    );

    //methods to serialize and de-serialize user
    passport.serializeUser
    (
        (user, done) =>
        {
            done(null, user.id);
        }
    );

    passport.deserializeUser
    (
        (id, done) =>
        {
            LawyerDetails.findById
            (
                id,
                (err, user) =>
                {
                    done(err, user);
                }
            );
        }
    );
}


let govEmpStrategy=(passport) =>
{
    passport.use
    (
        new LocalStrategy
        (
            {usernameField: 'email',},
            (email, password,personType, done) => //theses are user passed in email and pass
            {
                //match user
                console.log("person type "+ personType)
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

                        if(!user) //if no match
                            return done(null, false, {message: 'That e-mail is not registered...'});
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

                                if(isMatch)
                                    return done(null, user);
                                else
                                    return done(null, false, {message: 'Password incorrect...'});
                            }
                        );
                    }
                ).catch
                (
                    (err) => console.log(err)
                );
            }
        )
    );

    //methods to serialize and de-serialize user
    passport.serializeUser
    (
        (user, done) =>
        {
            done(null, user.id);
        }
    );

    passport.deserializeUser
    (
        (id, done) =>
        {
            GovEmpDetails.findById
            (
                id,
                (err, user) =>
                {
                    done(err, user);
                }
            );
        }
    );
}

module.exports = userStrategy;
// module.exports ={
//     "userStrategy":userStrategy,
//     "lawyerStrategy":lawyerStrategy,
//     "judgeStrategy":judgeStrategy,
//     "govEmpStrategy":govEmpStrategy,
// }
