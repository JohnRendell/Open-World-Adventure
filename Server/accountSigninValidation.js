const express = require('express');
const router = express.Router();
const sanitizeHtml = require('sanitize-html');
const accountModel = require('./accountMongoose');
const bcryptJS = require('bcryptjs');

router.post('/', async (req, res)=>{
    const username = sanitizeHtml(req.body.username);
    const confirmPassword = sanitizeHtml(req.body.confirmPass);
    const password = sanitizeHtml(req.body.password);

    function hashPass(password){
        var salt = bcryptJS.genSaltSync(10);
        return bcryptJS.hashSync(password, salt);
    }

    const hasWhiteSpace = (s)=> {
        return (/\s/).test(s);
    }

    const hasSpecialChar = (s)=>{
        return (/['"]/).test(s);
    }

    if(username && password && confirmPassword){
        if(username.length <= 4){
            res.status(200).json({ message: 'Username is too short!' });
        }

        else if(hasWhiteSpace(username)){
            res.status(200).json({ message: 'Username should not have white space!' });
        }

        else if(hasSpecialChar(username)){
            res.status(200).json({ message: 'Username should not have illegal Character' });
        }
        
        else if(password.length <= 4){
            res.status(200).json({ message: 'Password is too short!' });
        }

        else if(password !== confirmPassword){
            res.status(200).json({ message: 'Password and confirm\nPassword not match!' });
        }

        else{
            try{
                const findAcc = await accountModel.findOne({ username: username });

                if(findAcc){
                    res.status(200).json({ message: 'username already exists.' });
                }
                else{
                    const createAcc = await accountModel.create({ username: username, password: hashPass(password), profile: 'none' });

                    if(createAcc){
                        res.status(200).json({ message: 'success' });
                    }
                }
            }
            catch(err){
                console.log(err);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }
    else{
        res.status(200).json({ message: 'Fields cannot be empty!' });
    }
});

module.exports = router;