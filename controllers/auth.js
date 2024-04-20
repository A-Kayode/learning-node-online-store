const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/user');


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_HOST_USER1,
        pass: process.env.EMAIL_HOST_PASSWORD1
    }
});

exports.getLogin = (req, res, next) => {
    // console.log(req.session.isLoggedIn);
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    }else{
        message = null;
    }
    res.render('auth/login', {path: '/login', pageTitle:'Login', errorMessage:message});
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.user = user;
                        req.session.isLoggedIn = true;
                        return req.session.save(error => {
                            console.log(error);
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Invalid email or password.');
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                })
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


exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    }else{
        message = null;
    }
    res.render('auth/signup', {path: '/signup', pageTitle: 'Signup', errorMessage: message});
};


exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({email: email})
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'Email exists already. Please use another email address.');
                return res.redirect('/signup');
            }
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({email: email, password: hashedPassword, cart: {items: []}});
                    return user.save();
                })
                .then(result => {
                    res.redirect('/login')
                    return transporter.sendMail({to: email, from:"Don's Shop", subject:"Sign-Up Successful", html:'<h1>Your Signup has been successful.</h1>'});
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))

};