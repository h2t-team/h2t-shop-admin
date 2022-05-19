const userService = require('./userService');

module.exports = {
    list: async(req, res) => {
        try {
            console.log(req.query)
            const page = (!isNaN(req.query.page) && req.query.page > 0) ? Number(req.query.page) : 1;
            const url = req.url;
            const keyword = req.query.keyword;

            //get user list and page count
            const users = keyword ? await userService.search(keyword, page - 1) : await userService.list(page - 1);
            const maxPage = Math.floor((users.count - 1) / 5) + 1;

            // render list
            res.render('user/users', { title: 'Users', users: users.rows, currentPage: page, maxPage, url, keyword, scripts: ['user.js'] });
        } catch (err) {
            console.log(err.message);
            res.status(500).send({ err: err.message });
        }
    },
    search: async(req, res) => {
        try {
            console.log(1)
                //get request params
            const page = (!isNaN(req.query.page) && req.query.page > 0) ? Number(req.query.page) : 1;
            const search = req.query.keyword;
            const url = req.url;
            //get admin and page count
            const users = search ? await userService.search(search, page - 1) : await userService.list(page - 1);
            const maxPage = Math.floor((users.count - 1) / 5) + 1;
            res.render('user/users', { title: 'Users', users: users.rows, currentPage: page, maxPage, search, url, scripts: ['user.js'] });
        } catch (err) {
            console.log(err.message);
            res.status(500).send({ err: err.message });
        }
    },
    lockUser: async(req, res) => {
        try {
            const { id, checkLock } = req.body;
            if (checkLock) {
                await userService.lockUser(id);
            } else {
                await userService.unlockUser(id);
            }
            res.status(200).send({ message: "OK" });
        } catch (err) {
            console.log(err.message);
            res.status(500).send({ message: err.message });
        }
    },
    detail: async(req, res) => {
        try {
            const id = req.params.userId;

            const user = await userService.findUserById(id);
            res.render('user/userDetail', { title: 'User Detail', user, scripts: ['user.js'] });
        } catch (err) {
            console.log(err.message);
            res.status(500).send({ message: err.message });
        }
    }
}