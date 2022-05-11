const productService = require('./productService');
const formidable = require('formidable');
const { uploadImage } = require('../../cloudinary')
const { v4: uuidv4 } = require('uuid');

module.exports = {
    validate: (req, res) => {
        console.log(req.body);

    },
    list: async(req, res) => {
        try {
            //get request params and url
            const page = (!isNaN(req.query.page) && req.query.page > 0) ? Number(req.query.page) : 1;
            const url = req.url;

            //get product list, category and page count
            const products = await productService.list(page - 1);
            const category = await productService.category();
            const maxPage = Math.floor((products.count.length - 1) / 8) + 1;
            res.render('product/products', { title: 'Products', products: products.rows, category, currentPage: page, maxPage, url, scripts: ['product.js'] });
        } catch (err) {
            res.status(500).send({ err: err.message });
        }
    },
    search: async(req, res) => {
        try {
            //get request params
            const page = (!isNaN(req.query.page) && req.query.page > 0) ? Number(req.query.page) : 1;
            const search = req.query.keyword ? req.query.keyword : '';
            const cat = req.query.category === 'all' ? '' : req.query.category;
            const url = req.url;

            //get product list, category and page count
            const products = await productService.search(cat, search, page - 1);
            const category = await productService.category();
            const maxPage = Math.floor((products.count.length - 1) / 8) + 1;

            res.render('product/products', { title: 'Products', products: products.rows, category, currentPage: page, maxPage, search, cat, url, scripts: ['product.js'] });
        } catch (err) {
            res.status(500).send({ err: err.message });
        }
    },
    addProductPage: async(req, res) => {
        try {
            const category = await productService.category();
            res.render('product/addProduct', { title: 'Add Product', category, scripts: ['product.js'] });
        } catch (err) {
            res.status(500).send({ err: err.message });
        }
    },
    addProductForm: async(req, res) => {
        try {
            const form = formidable({ multiples: true });
            form.parse(req, async(err, fields, files) => {
                if (err) {
                    next(err);
                    return;
                }
                const { pname, pcategory, pprice, pdesc, ...psizes } = fields;
                const id = uuidv4();
                const imageUrls = [];
                if (files.photos.length > 1) {
                    for (const item in files.photos) {
                        const res = await uploadImage(files.photos[item].filepath);
                        imageUrls.push(res.url);
                    }
                } else {
                    const res = await uploadImage(files.photos.filepath);
                    imageUrls.push(res.url);
                }
                await productService.addProduct(id, pname, pcategory, pprice, pdesc, psizes, imageUrls);
                res.redirect('/products');
            });
        } catch (err) {
            console.log(err.message);
            res.status(500).send({ message: err.message });
        }
    },
    updateProductPage: async(req, res) => {
        try {
            const id = req.params.productId;

            const product = await productService.findProductById(id);
            const productCategory = await productService.findCategoryById(product.category_id);
            const category = await productService.category();
            const categoryWithoutProductCategory = await productService.removeCurrentProductCategory(category, productCategory);
            const productSize = await productService.findProductSizeById(product.id);
            const productImage = await productService.findProductImageById(product.id);
            res.render('product/updateProduct', { title: 'Update Product', product, productCategory, productSize, productImage, categoryWithoutProductCategory, scripts: ['product.js'] });
        } catch (err) {
            console.log(err.message);
        }
    },
    updateProductForm: async(req, res) => {
        try {
            const { pid, pname, pcategory, pprice, pdesc, prate, psize, poldCategory } = req.body;
            console.log(req.body);
            await productService.updateProduct(pid, pname, pcategory, pprice, pdesc, prate, psize, poldCategory);
            res.status(200).send({ message: "OK" });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },
    removeProduct: async(req, res) => {
        try {
            const { id, category_id } = req.body;

            await productService.removeProduct(id, category_id);
            res.status(200).send({ message: "Success" });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    }
}