module.exports = {
    loginPage: (req, res) => {
        res.render('auth/login', { title: 'Login', message: req.flash('error') });
    }
}