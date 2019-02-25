const router = require('express').Router();
const db = require('../config/db-connection');

router.get('/get', (req, res) => {
    var query;
    if(req.user) query = 'SELECT * FROM notes WHERE owner = $1';
    else query = 'SELECT * FROM notes';
    db.any(query, req.user ? [req.user.id] : null)
    .then((result) => {
        for(var i=0; i<result.length; i++) {
            result[i].note ? result[i].note = result[i].note.split('\n').join("\\n") : '';
        }
        res.type('html');
        res.send(result);
    }).catch((err) => {
        res.sendStatus(450);
    });
})

router.post('/add', (req, res) => {
    if(req.user) {
        db.any('INSERT INTO notes(name, note, owner) VALUES ($1, $2, $3)', [req.body.name, req.body.note, req.user.id])
        .then((result) => {
            res.sendStatus(200);
        }).catch((err) => {
            res.sendStatus(450);
        });
    } else res.sendStatus(450);
});

router.delete('/delete/:id', (req, res) => {
    if(req.user) {
        db.any('DELETE FROM notes WHERE id = $1', [req.params.id])
        .then((result) => {
            res.sendStatus(200);
        }).catch((err) => {
            res.sendStatus(450);
        });
    } else res.sendStatus(450);
});

router.put('/update', (req, res) => {
    if(req.user) {
        db.any('UPDATE notes SET name=$1, note=$2 WHERE id=$3', [req.body.name, req.body.note, req.body.id])
        .then((result) => {
            res.sendStatus(200);
        }).catch((err) => {
            res.sendStatus(450);
        });
    } else res.sendStatus(450);
});

module.exports = router;