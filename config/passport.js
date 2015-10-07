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

    passport.use('local-login', new LocalStrategy(
        function(email, password, done) {
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

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }

            });
        }
    ));

};