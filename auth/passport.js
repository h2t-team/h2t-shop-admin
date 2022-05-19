const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { models } = require('../models');
const bcrypt = require('bcrypt');

passport.use(
    new LocalStrategy(async function(username, password, done) {
        try {
            const user = await models.admin.findOne({
                where: {
                    username
                },
                raw: true
            });
            if (!user) {
                return done(null, false, { message: "Incorrect username." });
            }
            if (!validPassword(user, password)) {
                return done(null, false, { message: "Incorrect password." });
            }
            if (isUserLock(user)) {
                return done(null, false, { message: "Your account has been blocked." });
            }
            return done(null, user);
        } catch (err) {
            console.log(err)
            return done(err);
        }
    })
);

// check valid password
const validPassword = (user, password) => bcrypt.compareSync(password, user.password);

// check if user account was locked
const isUserLock = user => user.lock === 1;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    models.admin.findByPk(id, { raw: true })
        .then(res => done(null, res))
        .catch(err => done(err));
});

module.exports = passport;