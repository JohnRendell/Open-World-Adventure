const express = require('express');
const router = express.Router();
const Fetch = require('node-fetch');
const FormData = require('form-data');
const path = require('path');
const multer = require('multer');
require('dotenv').config({ path: path.resolve(__dirname, '../keys.env') });

const upload = multer();

router.post('/', upload.single('image'), async (req, res)=>{
    try{
        const image = req.file;
        const album = 'UEqHHkz';
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
            res.status(200).json({ message: 'success', link: uploadImageImgur_data.data.link, spriteID: uploadImageImgur_data.data.id });
        }
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;