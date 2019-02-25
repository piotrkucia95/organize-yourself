const router = require('express').Router();
const db = require('../config/db-connection');

router.get('/get', (req, res) => {
    var query;
    if(req.user) query = 'SELECT * FROM todos WHERE owner = $1';
    else query = 'SELECT * FROM todos';

    db.any(query, req.user ? [req.user.id] : null)
    .then((result) => {
        res.send(result);
    }).catch((err) => {
        res.sendStatus(450);
    });
});

router.post('/add', (req, res) => {
    if(req.user) {
        db.any('INSERT INTO todos(name, date, done, description, owner) VALUES ($1, $2, $3, $4, $5)', [req.body.name, req.body.date, req.body.done, req.body.description, req.user.id])
        .then((result) => {
            res.sendStatus(200);
        }).catch((err) => {
            res.sendStatus(450);
        });
    } else res.sendStatus(450);
});

router.delete('/delete/:id', (req, res) => {
    if(req.user) {
        db.any('DELETE FROM todos WHERE id = $1', [req.params.id])
        .then((result) => {
            res.sendStatus(200);
        }).catch((err) => {
            res.sendStatus(450);
        });
    } else res.sendStatus(450);
});

router.put('/update', (req, res) => {
    if(req.user) {
        db.any('UPDATE todos SET name=$1, date=$2, done=$3, description=$4 WHERE id=$5', [req.body.name, req.body.date, req.body.done, req.body.description, req.body.id])
        .then((result) => {
            res.sendStatus(200);
        }).catch((err) => {
            res.sendStatus(450);
        });
    } else res.sendStatus(450);
});

module.exports = router;