const express = require('express');
const router = express.Router();
const sanitizeHtml = require('sanitize-html');
const accountModel = require('./accountMongoose');
const bcryptJS = require('bcryptjs');
const cookieParser = require('cookie-parser');
const path = require('path');
const CryptoJS = require('crypto-js');

require('dotenv').config({ path: path.resolve(__dirname, '../keys.env') });

router.use(cookieParser(process.env.COOKIE_KEY));

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
                const spritesArr = [
                    'https://i.imgur.com/xhU6u5B.png',
                    'https://i.imgur.com/Qq3Yedn.png',
                    'https://i.imgur.com/4BkMHTS.png'
                ];

                if(findAcc){
                    res.status(200).json({ message: 'username already exists.' });
                }
                else{
                    const createAcc = await accountModel.create({ username: username, password: hashPass(password), profile: 'https://i.imgur.com/ajVzRmV.jpg', sprites: spritesArr });

                    if(createAcc){
                        let encryptPlayerName = CryptoJS.AES.encrypt(username, 'token').toString();

                        res.cookie('username', encryptPlayerName, { signed: true, httpOnly: true, maxAge: 3600000, secure: true });
                        res.status(200).json({ message: 'success', username: encryptPlayerName });
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