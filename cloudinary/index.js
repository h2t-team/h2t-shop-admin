const cloudinary = require('cloudinary');
const { v4: uuidv4 } = require('uuid');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadImage = (imgPath) => {
    return cloudinary.v2.uploader.upload(imgPath, { public_id: uuidv4() });
}

module.exports = {
    uploadImage
}