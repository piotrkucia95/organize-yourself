const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const loginRoutes = require('./routes/oauth-routes');
const registerRoutes = require('./routes/register-routes');
const todosRoutes = require('./routes/todos-routes');
const notesRoutes = require('./routes/notes-routes');
const userRoutes = require('./routes/user-routes');
const passportSetup = require('./config/passport-setup');
const passport = require('passport');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
    maxAge: 24 + 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/todos', todosRoutes);
app.use('/notes', notesRoutes);
app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);

app.get('/', (req, res) => {
    if(!req.user) res.sendFile(path.join(__dirname + '/public/home.html'));
    else res.sendFile(path.join(__dirname + '/public/main.html'));
});

app.get('/user', (req, res) => {
    res.send(req.user);
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/main.html'));
});

app.get('/todos', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/main.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/main.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/about.html'));
});

app.listen(PORT, () => {
    console.log('Listening on port: ' + PORT);
});