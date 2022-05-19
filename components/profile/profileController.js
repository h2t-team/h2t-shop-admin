const adminService = require('../ad/adminService');

module.exports = {
    editAccount: (req, res) => {
        const user = req.user;
        console.log(req.user)
        res.render('profile/editAccount', { title: 'Edit Account', user, scripts: ['admin.js'] });
    }
}