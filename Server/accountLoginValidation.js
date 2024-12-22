const express = require('express');
const router = express.Router();
const sanitizeHtml = require('sanitize-html');

router.post('/', (req, res)=>{
    const username = sanitizeHtml(req.body.username);
    const password = sanitizeHtml(req.body.password);

    if(username && password){
        res.status(200).json({ message: 'Success' });
    }
    else{
        res.status(200).json({ message: 'Fields cannot be empty!' });
    }
});

module.exports = router;