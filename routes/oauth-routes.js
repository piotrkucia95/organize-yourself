const router = require('express').Router();
const passport = require('passport');
const bodyParser = require('body-parser');

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.post('/credentials', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err) return res.send({'status':'err','message': err.message}); 
        if(!user) {
            return res.send({
                'status':'fail', 
                'message': 'Wrong username or password.'
            }); 
        } else if(user.isActive == false) {
            return res.send({
                'status':'fail', 
                'message': 'User not active. Activate user using a link we sent You after registration.'
            }); 
        } else {
            req.logIn(user, function(err) {
                if (err) { return res.send({'status':'err','message': err.message}); }
                return res.send({'status':'ok'});
            })
        }
    })(req, res, next);
}, (err, req, res, next) => {
    return res.send({'status':'err','message': err.message});
});

router.get('/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
}));

router.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
    res.redirect('/');
});

router.get('/google', passport.authenticate('google', {
    scope: ['profile', ['email']]
}));

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/');
});

module.exports = router;