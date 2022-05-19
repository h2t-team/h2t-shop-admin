const adminService = require('./adminService');

module.exports = {
    list: async(req, res) => {
        try {
            //get request params and url
            const page = (!isNaN(req.query.page) && req.query.page > 0) ? Number(req.query.page) : 1;
            const url = req.url;

            //get admin list and page count
            const admins = await adminService.list(page - 1);
            const maxPage = Math.floor((admins.count - 1) / 5) + 1;
            res.render('ad/admins', { title: 'Admins', admins: admins.rows, currentPage: page, maxPage, url, scripts: ['admin.js'] });
        } catch (err) {
            console.log(err.message);
        }
    },
    search: async(req, res) => {
        try {
            //get request params
            const page = (!isNaN(req.query.page) && req.query.page > 0) ? Number(req.query.page) : 1;
            const search = req.query.keyword;
            const url = req.url;

            //get admin and page count
            const admins = search ? await adminService.search(search, page - 1) : await adminService.list(page - 1);
            const maxPage = Math.floor((admins.count - 1) / 8) + 1;
            res.render('ad/admins', { title: 'Admins', admins: admins.rows, currentPage: page, maxPage, search, url, scripts: ['admin.js'] });
        } catch (err) {
            console.log(err.message);
        }
    },
    addAdminPage: async(req, res) => {
        try {
            res.render('ad/addAdmin', { title: 'Add Admin', scripts: ['admin.js'] });
        } catch (err) {
            console.log(err.message);
        }
    },
    addAdminForm: async(req, res) => {
        try {
            const { lastName, firstName, username, password, email, telephone } = req.body;
            await adminService.addAdmin(lastName, firstName, username, password, email, telephone);
            res.status(200).send({ message: "OK" });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },
    updateAdminPage: async(req, res) => {
        try {
            const id = req.params.adminId;
            const admin = await adminService.findAdminById(id);
            res.render('ad/updateAdmin', { title: 'Update Admin', admin, scripts: ['admin.js'] });
        } catch (err) {
            console.log(err.message);
        }
    },
    updateAdminForm: async(req, res) => {
        try {
            const { id, lastName, firstName, email, telephone } = req.body;
            await adminService.updateAdmin(id, lastName, firstName, email, telephone);
            res.status(200).send({ message: "OK" });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },
    lockAdmin: async(req, res) => {
        try {
            const { id, checkLock } = req.body;
            if (id === req.user.id) {
                res.status(400).send({ message: `You can't lock your account!` });
            } else {
                if (checkLock) {
                    await adminService.lockAdmin(id);
                } else {
                    await adminService.unlockAdmin(id);
                }
                res.status(200).send({ message: "OK" });
            }
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },
    detail: async(req, res) => {
        try {
            const id = req.params.adminId;
            const admin = await adminService.findAdminById(id);
            res.render('ad/adminDetail', { title: 'Admin Detail', admin, scripts: ['admin.js'] });
        } catch (err) {
            console.log(err.message);
        }
    }
}