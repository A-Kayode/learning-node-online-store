const express = require('express');
const {check, body} = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post(
    '/login',
    body('email', "Invalid Email").isEmail().normalizeEmail(),
    body('password', "Please enter a password with numbers and letters, a symbol, and at least 5 characters").isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 0, minNumbers: 1, minSymbols: 1}).trim(),
    authController.postLogin
);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post(
    '/signup', 
    check('email').isEmail().withMessage('Please enter a valid email.').custom((value, {req}) => {
        // if (value === 'tester@test.com') {
        //     throw new Error('This email address is forbidden')
        // }
        // return true;
        return User.findOne({email: value})
        .then(userDoc => {
            if (userDoc) {
                return Promise.reject('Email exists already. Please use another email address.');
            }
        })
    })
    .normalizeEmail(),
    body('password', "Please enter a password with numbers and letters, a symbol, and at least 5 characters").isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 0, minNumbers: 1, minSymbols: 1}).trim(),
    body('confirmPassword').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Passwords have to match!');
        }
        return true;
    })
    .trim(),
    authController.postSignup);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;