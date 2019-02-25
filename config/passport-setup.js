const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth20');
const LocalStrategy = require('passport-local');
const keys = require('../config/keys');
const db = require('../config/db-connection');
const user = require('../config/user');
const bcrypt = require('bcryptjs');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.any('SELECT * FROM users WHERE id = $1', [id])
        .then((result) => {
            loggedUser = {
                id: result[0].id,
                username: result[0].username,
                email: result[0].email,
                displayName: result[0].display_name,
            }
            done(null, loggedUser);
        })
        .catch((err) => {});
});

function comparePass(userPassword, databasePassword) {
    return bcrypt.compareSync(userPassword, databasePassword);
}
  
passport.use(new LocalStrategy((username, password, done) => {
    db.any('SELECT * FROM users WHERE username=$1', [username])
    .then((result) => {
        if(result.length == 0) {
            return done(null, false);
        } else if(!comparePass(password, result[0].password)) {
            return done(null, false);
        } else {
            db.any('SELECT id FROM users WHERE username=$1', [username])
            .then((idResult) => {
                console.log('correct login');
                var loggedUser = user.createUser(username, password, result[0].email, result[0].facebook_id, 
                                                 result[0].google_id, idResult[0].id, result[0].is_active, result[0].display_name);
                
                done(null, loggedUser);
            })
            .catch((error) => {});
        }
    })
    .catch((err) => {});
}));

passport.use(new FacebookStrategy({
    callbackURL: keys.siteURL + '/login/facebook/redirect',
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    profileFields: ['id', 'displayName', 'name', 'gender', 'email']
}, (accessToken, refreshToken, profile, done) => {
    db.any('SELECT * FROM users WHERE facebook_id = $1', [profile.id])
        .then((result) => {
            if(result.length == 0) {
                var newUser = user.createUser('', '', profile.emails[0].value, profile.id, '', '', true, profile.displayName);
                db.any('INSERT INTO users(email, facebook_id, is_active, display_name) VALUES ($1, $2, $3, $4)',
                    [newUser.email, newUser.facebookId, true, newUser.displayName])
                    .then(() => {
                        db.any('SELECT max(id) FROM users')
                        .then((idResult) => {
                            newUser.id = idResult[0].max;
                            console.log('user inserted into database!');
                            done(null, newUser);
                        })
                        .catch((error) => {
                            console.log(error.message);
                        });
                    })
                    .catch((err) => {
                        console.log(err.message);
                        done(null, profile);
                    });
            } else {
                var currentUser = user.createUser(result[0].username, result[0].password, result[0].email, result[0].facebook_id, 
                                                  result[0].google_id, result[0].id, result[0].is_active, result[0].display_name);
                console.log('user exists in the database!');
                done(null, currentUser);
            }
        })
        .catch((err) => {});
}));

passport.use(new GoogleStrategy({
    callbackURL: keys.siteURL + '/login/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    db.any('SELECT * FROM users WHERE google_id = $1', [profile.id])
        .then((result) => {
            if(result.length == 0) {
                var newUser = user.createUser('', '', profile.emails[0].value, '', profile.id, '', true, profile.displayName);
                db.any('INSERT INTO users(email, google_id, is_active, display_name) VALUES ($1, $2, $3, $4)',
                    [newUser.email, newUser.googleId, true, newUser.displayName])
                    .then(() => {
                        db.any('SELECT max(id) FROM users')
                        .then((idResult) => {
                            newUser.id = idResult[0].max;
                            console.log('user inserted into database!');
                            done(null, newUser);
                        })
                    })
                    .catch((err) => {
                        console.log('err1');
                        done(null, profile);
                    });
            } else {
                var currentUser = user.createUser(result[0].username, result[0].password, result[0].email, result[0].facebook_id, 
                                                  result[0].google_id, result[0].id, result[0].is_active, result[0].display_name);
                console.log('user exists in the database!');
                done(null, currentUser);
            }
        })
        .catch((err) => {
            console.log('err2');
            done(null, profile);
        });
}));