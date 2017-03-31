var LocalStrategy   = require('passport-local').Strategy;
var User            = require('./../models/userModel').User;

var emailHelper = require('./../utils/emailHelper');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        User.findOne({ 'email' :  email }, function(err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, {errorMessage: 'No user with that email found.'});
            }

            if (!user.validPassword(password)) {
                return done(null, false, {errorMessage: 'Wrong password.'});
            }

            return done(null, user);
        });
    }));

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },

    function(req, email, password, done) {
        User.findOne({ 'email' :  email }, function(err, user) {
            if (err) {
                return done(err);
            }

            if (user) {
                return done(null, false, {errorMessage: 'That email is already taken.'});
            } else {
                var newUser = new User();

                newUser.email = email;
                newUser.password = newUser.generateHash(password);
                newUser.username = req.body.username;
                newUser.major = req.body.major;
                newUser.graduatingClass = req.body.graduatingClass;
                newUser.image = "/images/default-person.jpg";
                newUser.shownInTeamPage = false;

                User.findOne({ 'admin':  true }, function(err, adminUser) {
                    if (adminUser) {
                        newUser.admin = false;
                    } else {
                        newUser.admin = true;
                        newUser.shownInTeamPage = true;
                    }

                    emailHelper.sendEmail(adminUser.email, 'New Olin Baja User', 'Hello,\n\n'+newUser.username+' has created an account on the Olin Baja site. They need your confirmation to be shown in the team page. Login and go to the admin page to confirm this user.');

                    // save the user
                    newUser.save(function(err) {
                        if (err) {
                            throw err;
                        }
                        return done(null, newUser);
                    });
                });
            }

        });
    }));

};