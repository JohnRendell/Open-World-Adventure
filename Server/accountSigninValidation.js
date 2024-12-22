const express = require('express');
const router = express.Router();
const sanitizeHtml = require('sanitize-html');

router.post('/', (req, res)=>{
    const username = sanitizeHtml(req.body.username);
    const confirmPassword = sanitizeHtml(req.body.confirmPass);
    const password = sanitizeHtml(req.body.password);

    if(username && password && confirmPassword){
        if(username.length <= 4){
            res.status(200).json({ message: 'Username is too short!' });
        }
        
        else if(password.length <= 4){
            res.status(200).json({ message: 'Password is too short!' });
        }

        else if(password !== confirmPassword){
            res.status(200).json({ message: 'Password and confirm\nPassword not match!' });
        }

        else{
            try{
                res.status(200).json({ message: 'success' });
            }
            catch(err){
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }
    else{
        res.status(200).json({ message: 'Fields cannot be empty!' });
    }
});

module.exports = router;