const User = require('../models/user');

exports.getLogin = (req, res, next) => {
//    const isLoggedIn = req.get('Cookie').split(';')[0].trim().split('=')[1] === 'true';
//    console.log(isLoggedIn);
    console.log(req.session.isLoggedIn);
    res.render('auth/login', {path: '/login', pageTitle:'Login', isAuthenticated: req.session.isLoggedIn});
};

exports.postLogin = (req, res, next) => {
    User.findById('659411b7beb407a08a467de6')
        .then(user => {
            req.session.user = user;
            req.session.isLoggedIn = true;
            req.session.save(error => {
                res.redirect('/');
            });
        })
        .catch(err => {
            console.log(err);
            req.session.isLoggedIn = false;
        });
};


exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
};