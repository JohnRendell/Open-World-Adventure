const express = require('express');
const router = express.Router();
const Fetch = require('node-fetch');
const FormData = require('form-data');
const path = require('path');
const multer = require('multer');
require('dotenv').config({ path: path.resolve(__dirname, '../keys.env') });

const upload = multer();

//TODO: do validating on user
router.post('/', upload.single('image'), async (req, res)=>{
    try{
        const image = req.file;
        const album = 'BkaAHPo';
        const formData = new FormData();
        formData.append('image', image.buffer.toString('base64'));
        formData.append('album', album);

        const uploadImageImgur = await Fetch('https://api.imgur.com/3/image', {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.IMGUR_TOKEN}`
            },
            body: formData
        });

        const uploadImageImgur_data = await uploadImageImgur.json();

        if(uploadImageImgur_data.success){
            //deletehash, link
            console.log(uploadImageImgur_data);
            res.status(200).json({ message: 'success' });
        }
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;