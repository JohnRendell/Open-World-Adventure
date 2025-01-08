const express = require('express');
const router = express.Router();
const path = require('path');
const cookieParser = require('cookie-parser');
const CryptoJS = require('crypto-js');

require('dotenv').config({ path: path.resolve(__dirname, '../keys.env') });

router.use(cookieParser(process.env.COOKIE_KEY));

//this set cookie is for only guest alright
router.post('/setCookie', (req, res)=>{
    try{
        let user = req.body.username;

        let decryptPlayerName = CryptoJS.AES.decrypt(user, 'tempPlayerName').toString(CryptoJS.enc.Utf8);

        if(decryptPlayerName){
            res.cookie('username', user, { signed: true, httpOnly: true, maxAge: 90000 });
            res.status(200).json({ message: 'success', username: user });
        }
    }
    catch(err){
        console.log(err);
        res.status(200).json({ message: 'setting up cookie failed' });
    }
});

router.post('/getCookie', (req, res)=>{
    try{
        let guaranteedAccess = req.body.guaranteedAccess;

        if(guaranteedAccess){
            let usernameCookie = req.signedCookies.username;
    
            if(usernameCookie){
                let decryptPlayerName;

                //for logged in player
                if(CryptoJS.AES.decrypt(usernameCookie, 'token').toString(CryptoJS.enc.Utf8)){
                    decryptPlayerName = CryptoJS.AES.decrypt(usernameCookie, 'token').toString(CryptoJS.enc.Utf8);
                }

                //for guest
                if(CryptoJS.AES.decrypt(usernameCookie, 'tempPlayerName').toString(CryptoJS.enc.Utf8)){
                    decryptPlayerName = CryptoJS.AES.decrypt(usernameCookie, 'tempPlayerName').toString(CryptoJS.enc.Utf8);
                }

                if(decryptPlayerName){
                    res.status(200).json({ message: 'success', decryptPlayerName: decryptPlayerName });
                }
            }
            else{
                res.status(200).json({ message: 'no cookie' });
            }
        }
    }
    catch(err){
        console.log(err);
    }
});

router.get('/deleteCookie', (req, res)=>{
    res.clearCookie('username');
    res.status(200).json({ message: 'cookies has been deleted'});
});

module.exports = router;