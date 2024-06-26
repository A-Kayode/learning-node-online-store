const path = require('path');

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoSessionStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
require('dotenv').config()

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/errors');
const User = require('./models/user');
const isAuth = require('./middleware/is-auth');

const MongoDbURI = 'mongodb://127.0.0.1:27017/learning-node'

const app = express();
const sessionStore = new MongoSessionStore({uri: MongoDbURI, collection: 'sessions'});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: "somethignanotherthing", resave: false, saveUninitialized: false, store: sessionStore}));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if (req.session.user) {
        User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
    }
    else {
        next();
    }
    
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', isAuth, adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(MongoDbURI)
    .then(result => {
        app.listen(3000);
    })
    .catch(err => console.log(err));