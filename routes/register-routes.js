const router = require('express').Router();
const request = require('request');
const keys = require('../config/keys');
const db = require('../config/db-connection');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: keys.gmail.user,
        pass: keys.gmail.pass
    }
});

router.post('/', (req, res) => {
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + keys.recaptcha.secret + "&response=" + req.body.recaptchaResponse;
    
    request(verificationUrl, (error, response, body) => { 
        body = JSON.parse(body);
        if(error || !body.success) {
            res.send('RECAPTCHA ERROR');
            return;
        }
        db.any('SELECT * FROM users WHERE username = $1', [req.body.username])
        .then((user) => {
            if(user.length == 0) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err) return res.send(err.message);
                    else {
                        db.any('INSERT INTO users(username, password, email, is_active, display_name) VALUES ($1, $2, $3, $4, $5)', 
                           [req.body.username, hash, req.body.email, false, req.body.displayName])
                        .then((result) => {
                            var mailOptions = {
                                from: keys.gmail.user,
                                to: req.body.email,
                                subject: 'Organize yourself! - activation link',
                                html: 'Hi, this is Organize Yourself! <br/>' +
                                      'Click the link below to finish your registration: <br/>' + 
                                      '<a href="' + keys.siteURL + '/register/activate?username=' + req.body.username + '">Activate account</a>'
                            };
                            transporter.sendMail(mailOptions, (err, info) => {});
                            res.send('SUCCESS');
                        })
                        .catch((e) => {
                            res.send(err.message);
                        });
                    }
                })
            } else {
                res.send('USER EXISTS');
            }
        }).catch((err) => {
            res.send(err.message);
        });
    });
});

router.get('/activate', (req, res) => {
    var username = req.query.username;
    if(!username) {
        res.send('Page not found!');
        return;
    };
    db.any('UPDATE users SET is_active=$1 WHERE username=$2', [true, req.query.username])
    .then((result) => {
        res.redirect('/');
    })
    .catch((err) => {});
});

module.exports = router;