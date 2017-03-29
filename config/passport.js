var LocalStrategy   = require('passport-local').Strategy;
var User            = require('./../models/userModel').User;

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

                User.findOne({ 'admin':  true }, function(err, user) {
                    if (user) {
                        newUser.admin = false;
                    } else {
                        newUser.admin = true;
                    }

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