var LocalStrategy   = require('passport-local').Strategy;
var User            = require('./../models/models').User;

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
        console.log("local-login");
        User.findOne({ 'email' :  email }, function(err, user) {
            if (err)
                return done(err);

            if (!user) {
                console.log("No user exists");
                return done(null, false, req.flash('loginMessage', 'No user found'));
            }

            if (!user.validPassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Wrong password'));
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
        console.log("local-login");
        User.findOne({ 'email' :  email }, function(err, user) {
            if (err)
                return done(err);

            if (user) {
                console.log("User exists");
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
                console.log("User doesn't exist");
                var newUser            = new User();

                newUser.email    = email;
                newUser.password = newUser.generateHash(password);
                newUser.username = req.body.username;
                newUser.major = req.body.major;
                newUser.image = "";

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });
    }));

};