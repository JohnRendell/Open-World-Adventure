const express = require('express');
const router = express.Router();
const path = require('path');
const cookieParser = require('cookie-parser');
const CryptoJS = require('crypto-js');

require('dotenv').config({ path: path.resolve(__dirname, '../keys.env') });

router.use(cookieParser(process.env.COOKIE_KEY));

router.post('/setCookie', (req, res)=>{
    try{
        let user = req.body.username;
        let cryptoKey = req.body.cryptoKey;

        let decryptPlayerName = CryptoJS.AES.decrypt(user, cryptoKey).toString(CryptoJS.enc.Utf8);

        if(decryptPlayerName){
            //add httpOnly: true later on
            res.cookie('username', user, { signed: true, maxAge: 3600000, secure: true, path: '/' });
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
                let playerToken = CryptoJS.AES.decrypt(usernameCookie, 'token').toString(CryptoJS.enc.Utf8);
                let guestToken = CryptoJS.AES.decrypt(usernameCookie, 'tempPlayerName').toString(CryptoJS.enc.Utf8);

                //for logged in player
                if(playerToken){
                    res.status(200).json({ message: 'success', decryptPlayerName: playerToken, encryptPlayerName: usernameCookie });
                }

                //for guest
                if(guestToken){
                    res.status(200).json({ message: 'success', decryptPlayerName: guestToken });
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