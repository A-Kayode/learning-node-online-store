exports.getLogin = (req, res, next) => {
   const isLoggedIn = req.get('Cookie').split(';')[0].trim().split('=')[1] === 'true';
   console.log(isLoggedIn);
   console.log(req.get('Cookie'));
    res.render('auth/login', {path: '/login', pageTitle:'Login', isAuthenticated: isLoggedIn});
};

exports.postLogin = (req, res, next) => {
    // req.session.isLoggedIn = true;
    res.setHeader('Set-Cookie', 'loggedIn=true');
    res.redirect('/');
};