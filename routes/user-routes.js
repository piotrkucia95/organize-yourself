const router = require('express').Router();
const db = require('../config/db-connection');
const bcrypt = require('bcryptjs');

function updateUserInDatabase(req, res) {
    db.any('UPDATE users SET ' + req.body.type + ' = $1 WHERE id = $2', [req.body.newValue, req.user.id])
    .then((result2) => {
        res.sendStatus(200);
    })
    .catch((err2) => {
        console.log(err2.message);
        res.sendStatus(450);
    });
}

router.post('/change', (req, res) => {
    if(req.body.type == 'displayName') req.body.type = 'display_name';
    if(req.user) {
        if(req.body.type == 'username') {
            db.any('SELECT * FROM users WHERE username = $1', [req.body.newValue])
            .then((result1) => {
                if(result1.length != 0) {
                    res.send('USER EXISTS');
                    return;
                } else {
                    updateUserInDatabase(req, res);
                }
            })
            .catch((err1) => {
                res.sendStatus(450);
            });
        } else {
            updateUserInDatabase(req, res);
        }
    } else {
        res.sendStatus(450);
    }
});

router.post('/change-password', (req, res) => {
    if(req.user) {
        db.any('SELECT * FROM users WHERE id = $1', [req.user.id])
        .then((result1) => {
            if(!bcrypt.compareSync(req.body.currentPassword, result1[0].password)) {
                res.send('WRONG PASSWORD');
                return;
            } else {
                bcrypt.hash(req.body.newValue, 10, (err2, hash) => {
                    if(err2) {
                        res.sendStatus(450);
                        return;
                    }
                    db.any('UPDATE users SET password = $1 WHERE id = $2', [hash, req.user.id])
                    .then((result2) => {
                        res.sendStatus(200);
                    })
                    .catch((err3) => {
                        res.sendStatus(450);
                    });
                });
            }
        })
        .catch((err1) => {
            res.sendStatus(450);
        });
    } else {
        res.sendStatus(450);
    }
});

module.exports = router;